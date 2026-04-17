attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat4 u_camera;

varying highp vec2 v_uv;

void main() {
    gl_Position = u_camera * vec4(a_position.xyz, 1.0);
    v_uv = a_uv;
}