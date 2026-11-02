# Builds a glass architecture diagram (three floors, blocks, linking rods)
# and exports it as GLB for the site, plus a PNG preview.
# Run: blender -b --python build_architecture.py
import bpy, math, os

OUT = os.path.dirname(os.path.abspath(__file__))

bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name, color, alpha=1.0, emission=0.0, rough=0.25):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Alpha"].default_value = alpha
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission
    if alpha < 1.0:
        m.blend_method = 'BLEND'
    return m

glass_blue = mat("GlassBlue", (0.23, 0.51, 0.96), alpha=0.35, rough=0.05)
floor_mat = mat("FloorGlass", (0.12, 0.25, 0.69), alpha=0.45, rough=0.08)
block_mat = mat("Block", (0.05, 0.09, 0.16), rough=0.3)
glow_mat = mat("Glow", (0.58, 0.77, 0.99), emission=6.0)
rod_mat = mat("Rod", (0.37, 0.65, 0.98), emission=3.0)

floors = []
for i in range(3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, i * 1.6))
    f = bpy.context.active_object
    f.name = f"Floor{i}"
    f.scale = (3.2, 2.0, 0.08)
    bpy.ops.object.modifier_add(type='BEVEL') if False else None
    f.data.materials.append(floor_mat)
    floors.append(f)

positions = [(-1.8, -0.9), (0.0, 0.0), (1.8, 0.9)]
for i in range(3):
    for j, (x, y) in enumerate(positions):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x * 0.9, y * 0.8, i * 1.6 + 0.2))
        b = bpy.context.active_object
        b.name = f"Block{i}{j}"
        b.scale = (0.5, 0.32, 0.14)
        b.data.materials.append(block_mat)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(x * 0.9, y * 0.8, i * 1.6 + 0.36))
        dot = bpy.context.active_object
        dot.name = f"Dot{i}{j}"
        dot.data.materials.append(glow_mat)

# Floor labels are drawn as HTML hotspots on the site, so no 3D text is built here.

for level in range(2):
    for x, y in [(-1.8, -0.9), (0.0, 0.0), (1.8, 0.9)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=1.6, location=(x * 0.9, y * 0.8, level * 1.6 + 0.8))
        r = bpy.context.active_object
        r.name = f"Rod{level}"
        r.data.materials.append(rod_mat)

# Lights and camera
bpy.ops.object.light_add(type='AREA', location=(4, -4, 6))
key = bpy.context.active_object
key.data.energy = 900
key.data.size = 6
bpy.ops.object.light_add(type='POINT', location=(-4, 3, 3))
bpy.context.active_object.data.energy = 300
bpy.ops.object.empty_add(location=(0, 0, 1.6))
target = bpy.context.active_object
bpy.ops.object.camera_add(location=(9.5, -9.5, 7.5))
cam = bpy.context.active_object
track = cam.constraints.new(type='TRACK_TO')
track.target = target
track.track_axis = 'TRACK_NEGATIVE_Z'
track.up_axis = 'UP_Y'
bpy.context.scene.camera = cam

world = bpy.data.worlds.new("World")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.01, 0.02, 0.05, 1)
bpy.context.scene.world = world

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1200
scene.render.resolution_y = 900
scene.render.film_transparent = False
scene.render.filepath = os.path.join(OUT, "architecture_preview.png")
bpy.ops.render.render(write_still=True)

bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, "architecture.glb"), export_format='GLB')
print("done", OUT)
