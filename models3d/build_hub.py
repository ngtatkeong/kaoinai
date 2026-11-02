# Integration hub: four source tiles on a glass platform, linked by glowing tubes
# to a central KaoinAI core. Exports GLB for the site.
# Run: blender -b --python build_hub.py
import bpy, math, os
import mathutils
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name, color, emission=0.0, alpha=1.0, rough=0.25):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Alpha"].default_value = alpha
    if emission:
        b.inputs["Emission Color"].default_value = (*color, 1.0)
        b.inputs["Emission Strength"].default_value = emission
    if alpha < 1.0:
        m.blend_method = 'BLEND'
    return m

platform_mat = mat("Platform", (0.12, 0.25, 0.69), alpha=0.35, rough=0.08)
tile_mat = mat("Tile", (0.08, 0.14, 0.26), rough=0.3)
core_mat = mat("Core", (0.23, 0.51, 0.96), emission=3.5)
tube_mat = mat("Tube", (0.58, 0.77, 0.99), emission=4.0)

# Platform
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
plat = bpy.context.active_object
plat.name = "Platform"
plat.scale = (3.0, 1.9, 0.06)
plat.data.materials.append(platform_mat)

# Core: a rounded block (cube with bevel)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.45))
core = bpy.context.active_object
core.name = "Core"
core.scale = (0.7, 0.55, 0.42)
bevel = core.modifiers.new("Bevel", 'BEVEL')
bevel.width = 0.12
bevel.segments = 6
core.data.materials.append(core_mat)

sources = [("PostgreSQL", -2.1, 1.1), ("Snowflake", 2.1, 1.1), ("NetSuite", -2.1, -1.1), ("BigQuery", 2.1, -1.1)]
tile_positions = []
for name, x, y in sources:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, 0.1))
    tile = bpy.context.active_object
    tile.name = f"Tile_{name}"
    tile.scale = (0.62, 0.36, 0.14)
    t = tile.modifiers.new("Bevel", 'BEVEL')
    t.width = 0.06
    t.segments = 4
    tile.data.materials.append(tile_mat)
    tile_positions.append((name, mathutils.Vector((x, y, 0.2))))

# Tubes from core to each tile, built as thin cylinders between two points
def tube(a, b, name):
    mid = (a + b) / 2
    d = b - a
    length = d.length
    bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=length, location=mid)
    c = bpy.context.active_object
    c.name = name
    c.rotation_mode = 'QUATERNION'
    c.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(d.normalized())
    c.data.materials.append(tube_mat)
    return c

core_point = mathutils.Vector((0, 0, 0.45))
for name, p in tile_positions:
    end = mathutils.Vector((p.x * 0.7, p.y * 0.7, 0.2))
    tube(core_point, end, f"Tube_{name}")
    dot = end
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, location=dot)
    bpy.context.active_object.data.materials.append(tube_mat)

# Light and camera
bpy.ops.object.light_add(type='AREA', location=(4, -4, 6))
bpy.context.active_object.data.energy = 900
bpy.context.active_object.data.size = 6
bpy.ops.object.empty_add(location=(0, 0, 0.3))
target = bpy.context.active_object
bpy.ops.object.camera_add(location=(0, -7.2, 5.6))
cam = bpy.context.active_object
tr = cam.constraints.new(type='TRACK_TO')
tr.target = target
tr.track_axis = 'TRACK_NEGATIVE_Z'
tr.up_axis = 'UP_Y'
bpy.context.scene.camera = cam

# Preview render
world = bpy.data.worlds.new("World")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.01, 0.02, 0.05, 1)
bpy.context.scene.world = world
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1200
scene.render.resolution_y = 800
scene.render.film_transparent = False
scene.render.filepath = os.path.join(OUT, "hub_preview.png")
bpy.ops.render.render(write_still=True)

bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, "hub.glb"), export_format='GLB')
print("done")
