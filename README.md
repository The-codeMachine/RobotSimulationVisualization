## Problem

Currently the world has no visual representation. Implementations such as port forwarding and JSON files have been made. This could potentially help with debugging. This may also help bring in more users and help non-technical users use this library. 

## Proposed solution

This will likely be a completely different program, not a feature within the library. Perhaps something like HTML/CSS/JS to show an easy to view visualization (using a browser), or a Python program. Since updates are forwarded in real time using a port, any language could work for this.

## Alternatives considered

Within the library, a real time visual feature could be made. Using a visualization library such as Raylib, it is possible to demonstrate a World's state, though this offers substantially less flexibility, but it makes it easier since it is integrated within the library.  

## Additional context

This program should be independent of the actual calculations so that tests can still run and it does not interfere with complex simulations (which require lots of computational power). Again, this is a visualization used for debugging purposes and to attract a larger audience, not a ground truth. 