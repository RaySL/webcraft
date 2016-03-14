attribute vec4 coordinate;
uniform mat4 perspective;
uniform float time;

void main(void) {
    gl_Position = perspective * coordinate;
}