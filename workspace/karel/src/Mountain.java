/*
 * TODO: comment this program
 */

import stanford.karel.*;

public class Mountain extends SuperKarel {
	
	public void run() {
		while(frontIsBlocked()) {
			stepUp();
		}
		putBeeper();
		while(frontIsClear()) {
			stepDown();
		}
	}

	private void stepDown() {
		move();
		turnRight();
		move();
		turnLeft();
	}

	private void stepUp() {
		turnLeft();
		move();
		turnRight();
		move();
	}

}
