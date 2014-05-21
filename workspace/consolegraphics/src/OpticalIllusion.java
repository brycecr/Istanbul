// TODO: comment this program

import acm.graphics.*;
import acm.program.*;
import java.awt.*;

/**
 * Topics:
 * parameters
 * 
 * Old topics:
 * graphics
 * loops
 */
public class OpticalIllusion extends GraphicsProgram {
	
	private static final int SIZE = 100;
	private static final int GAP = 10;
	private static final int APPLICATION_WIDTH = 540;
	private static final int APPLICATION_HEIGHT = 560;
	
	public void run() {
		setSize(APPLICATION_WIDTH, APPLICATION_HEIGHT);
		for(int i = 0; i < 5; i++) {
			for(int j = 0; j < 5; j++) {
				drawTile(i, j);
			}
		}
	}

	private void drawTile(int i, int j) {
		int x = i * (SIZE + GAP);
		int y = j * (SIZE + GAP);
		GRect square = new GRect(x, y , SIZE, SIZE);
		square.setFilled(true);
		add(square);
	}
}
