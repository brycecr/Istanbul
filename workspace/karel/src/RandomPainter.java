/*
 * TODO: comment this program
 */

import stanford.karel.*;

/**
 * Difficulty: HARD
 * Topics:
 * random numbers
 * nested loops
 * painting
 * 
 * Old topics:
 * methods
 * loops
 * karel
 *
 */
public class RandomPainter extends SuperKarel {
	
	public void run() {
		while(leftIsClear()) {
			paintRow();
			changeRow();
		}
		paintRow();
	}

	private void changeRow() {
		turnAround();
		while(frontIsClear()) {
			move();
		}
		turnRight();
		move();
		turnRight();
	}

	private void paintRow() {
		while(frontIsClear()) {
			randomPaint();
			move();
		}
		randomPaint();
		
	}

	private void randomPaint() {
		if(random(0.55)) {
			paintCorner(GREEN);
		} else {
			paintCorner(BLUE);
		}
	}

	

}
