ok, ok.

so this idea goes as follows.

we setup a grid for the world. this is an infinite scrolling type thing.

when we load the file we fill note the sections, but do not fill it. we only visual fill the stuff the user looks at.

the memory is a simple id plus string to represent what object it is (e.g. robot, wall, etc.)

during updates we are told the object's unique id. we find this unique id (perhaps an unordered map, similar to the actual world, for O(1) lookup)
after we find the id, we update the corresponding values (each object is a shell of the real class), and visually update it's position (we update the
grid and the memory). there will be "fake" classes, that essentially old the data. perhaps something like a `data` table that is filled with the name
of the variables (determined by the world loading file plus the updates). this is for debugging, and does not affect the visualization (at least yet).
we only actually update the position (visual position, and actual memory)