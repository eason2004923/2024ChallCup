$(document).ready(function() {
    $('#particles-container').Yoshi({
      num_particles: 100,
      min_distance: 50,
      particle_size: 3,
      max_size: 5,
      particle_color: 'blue',
      particle_shape: 'circle',
      particle_width: 3,
      max_particle_width: 3,
      particle_height: 0,
      max_particle_height: 0,
      canvas_color: 'transparent',
      speed_x: 'r',
      max_speed_y: 2,
      speed_y: 'r',
      max_speed_y: 2,
      velocity_x: 1,
      velocity_y: 1,
      x_type: 1,
      y_type: 1,
      acceleration_x: 0.01,
      acceleration_y: 0.01,
      draw_line: true,
      line_color: '#000000',
      line_width: 1,
      line_type: 'line',
      control_point_a_x: true,
      control_point_a_y: true,
      control_point_b_x: true,
      control_point_b_y: true
    });
  });
  