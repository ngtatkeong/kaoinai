# Builds a glowing core with three tilted orbit rings and exports a GLB.
# Run: blender -b --python build_orbit.py
import bpy, math, os
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name, color, emission=0.0, alpha=1.0, rough=0.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Alpha"].default_value = alpha
    if emission:
        b.inputs["Emission Color"].default_value = (*color, 1.0)
        b.inputs["Emission Strength"].default_value = emission
    return m

core_mat = mat("Core", (0.23, 0.51, 0.96), emission=3.0)
ring_mat = mat("Ring", (0.58, 0.77, 0.99), emission=4.0)
dot_mat = mat("Dot", (0.88, 0.95, 1.0), emission=8.0)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 0, 0), segments=64, ring_count=32)
bpy.context.active_object.name = "Core"
bpy.context.active_object.data.materials.append(core_mat)

tilts = [(70, 0), (50, 60), (84, -40)]
for i, (rx, rz) in enumerate(tilts):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.3, minor_radius=0.018, major_segments=160, minor_segments=12, location=(0, 0, 0))
    ring = bpy.context.active_object
    ring.name = f"Ring{i}"
    ring.rotation_euler = (math.radians(rx), 0, math.radians(rz))
    ring.data.materials.append(ring_mat)
    # a bright dot riding on each ring
    ang = math.radians(20 + i * 120)
    local = (1.3 * math.cos(ang), 1.3 * math.sin(ang), 0)
    e = ring.rotation_euler
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(0, 0, 0))
    dot = bpy.context.active_object
    dot.name = f"Dot{i}"
    dot.data.materials.append(dot_mat)
    # place the dot on the ring using the ring's rotation
    import mathutils
    v = mathutils.Vector(local)
    m = mathutils.Euler(e, 'XYZ').to_matrix()
    dot.location = m @ v

bpy.ops.object.light_add(type='POINT', location=(3, -3, 4))
bpy.context.active_object.data.energy = 600
bpy.ops.object.camera_add(location=(0, -5.2, 1.6), rotation=(math.radians(78), 0, 0))
bpy.context.scene.camera = bpy.context.active_object
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, "orbit.glb"), export_format='GLB')
print("done")
