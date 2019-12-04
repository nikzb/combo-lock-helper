const ORIGINAL_RADIUS = 100;
const MEDIUM_TURN_SPEED = 50;

const requestAnimFrame = window.requestAnimationFrame;

// An object used to store the rotations.
// totalAngle is the angle to turn
// number is the number in the combination, i.e. 1, 2, or 3
function ImageRotation(totalAngle, number) {
  return {
    totalAngle,
    number,
    angleTurned: 0
  };
}

export function lock(canvas, numbersOnDial, onResetComplete, onAnimationComplete) {
  const context = canvas.getContext("2d");
  
  const X_OFFSET = canvas.width / 2;
  const Y_OFFSET = canvas.height * 0.67;
  
  context.translate(X_OFFSET, Y_OFFSET);
  
  let speed = MEDIUM_TURN_SPEED;
  let currentAngle = 0;
  let radius = ORIGINAL_RADIUS;
  let mode = "unlock";
  let shouldOpen = true;
  let shackleIsOpen = false;
  let imageRotations;
  let numTicks = numbersOnDial;

  // Return the angle, in radians, for turning the given amount of numbers on the current dial
  function dialNumbersToRadians(dialNumbers) {
    return (dialNumbers * 2 * Math.PI) / numTicks;
  }

  function setSpeed(newSpeed) {
    speed = newSpeed;
  }

  function setNumbersOnDial(numbersOnDial) {
    numTicks = numbersOnDial;
  }

  // Clear the canvas so a new image can be drawn
  function clearCanvas() {
    // clear the previous image
    context.save();
    // fix for correct offset
    context.translate(-X_OFFSET, -Y_OFFSET);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  function drawDial(radius) {
    context.beginPath();

    const startAngle = -Math.PI / 2;
    const endAngle = 1.5 * Math.PI;
    const counterClockwise = false;

    context.lineWidth = radius * 0.02;
    context.strokeStyle = "black";

    // draw outer circle of dial
    context.beginPath();
    context.arc(0, 0, radius, startAngle, endAngle, counterClockwise);
    context.fillStyle = "black";
    context.fill();
    context.stroke();

    // draw tick marks
    context.beginPath();
    context.strokeStyle = "white";

    for (
      let angle = startAngle;
      angle < endAngle;
      angle += (2 * Math.PI) / numTicks
    ) {
      // go to starting point
      let x = radius * Math.cos(angle);
      let y = radius * Math.sin(angle);
      context.moveTo(x, y);

      // move to make line
      x = radius * 0.9 * Math.cos(angle);
      y = radius * 0.9 * Math.sin(angle);
      context.lineTo(x, y);
    }

    context.stroke();

    // draw longer tick marks for multiples of 5
    context.beginPath();
    context.lineWidth = radius * 0.03;

    for (
      let angle = startAngle;
      angle < endAngle;
      angle += ((2 * Math.PI) / numTicks) * 5
    ) {
      // go to starting point
      let x = radius * Math.cos(angle);
      let y = radius * Math.sin(angle);
      context.moveTo(x, y);

      // move to make line
      x = radius * 0.8 * Math.cos(angle);
      y = radius * 0.8 * Math.sin(angle);
      context.lineTo(x, y);
    }

    context.stroke();

    // draw numbers for multiples of 5
    context.beginPath();

    let fontSize;
    if (numTicks > 40) {
      fontSize = Math.round(radius * 0.2) / (numTicks / 40);
    } else {
      fontSize = Math.round(radius * 0.2);
    }

    context.fillStyle = "white";
    context.font = "" + fontSize + "pt Arial";

    for (let number = 0; number < numTicks; number += 5) {
      context.save();
      context.rotate(((2 * Math.PI) / numTicks) * number);
      if (numTicks > 40) {
        if (number < 10)
          context.fillText(
            "" + number,
            -radius * fontSize * 0.0033,
            -radius * (0.6 + (numTicks - 40) * 0.001)
          );
        else
          context.fillText(
            "" + number,
            -radius * fontSize * 0.006,
            -radius * (0.6 + (numTicks - 40) * 0.001)
          );
      } else {
        if (number < 10)
          context.fillText("" + number, -radius * 0.07, -radius * 0.58);
        else context.fillText("" + number, -radius * 0.13, -radius * 0.58);
      }

      context.restore();
    }

    // draw knob
    var knobOuterCircleRadius = radius * 0.5;
    var knobInnerCircleRadius = radius * 0.43;

    context.lineWidth = radius * 0.01;
    context.beginPath();
    context.strokeStyle = "#303030";
    context.arc(
      0,
      0,
      knobOuterCircleRadius,
      startAngle,
      endAngle,
      counterClockwise
    );

    for (var angle = startAngle; angle < endAngle; angle += Math.PI / 40) {
      // go to starting point
      let x = knobOuterCircleRadius * Math.cos(angle);
      let y = knobOuterCircleRadius * Math.sin(angle);
      context.moveTo(x, y);

      // move to make line
      x = knobInnerCircleRadius * Math.cos(angle);
      y = knobInnerCircleRadius * Math.sin(angle);
      context.lineTo(x, y);
    }

    context.arc(
      0,
      0,
      knobInnerCircleRadius,
      startAngle,
      endAngle,
      counterClockwise
    );
    context.stroke();
  }

  // draw shackle
  function drawShackle(dialRadius) {
    const outsideX = dialRadius * 0.9; //dialRadius * Math.cos(-Math.PI / 4);
    const bottomY = 0; //dialRadius * Math.sin(-Math.PI / 4) + dialRadius * 0.5;
    const insideX = outsideX - dialRadius * 0.3;
    const topY = bottomY - dialRadius * 2.5;
    const bottomCurveY = topY + dialRadius; //bottom of where the shackle curves
    const bottomLeftY = bottomCurveY + dialRadius;
    const bottomNotchY = bottomLeftY - dialRadius * 0.2;
    const notchX = -(outsideX - dialRadius * 0.2);

    const counterClockwise = true;

    context.beginPath();
    context.lineWidth = dialRadius * 0.03;
    context.strokeStyle = "black";

    context.moveTo(outsideX, bottomY);
    context.lineTo(outsideX, bottomCurveY);
    context.arc(0, bottomCurveY, outsideX, 0, Math.PI, counterClockwise);
    context.lineTo(-outsideX, bottomLeftY);
    context.lineTo(-insideX, bottomLeftY);
    context.lineTo(-insideX, bottomNotchY);
    context.lineTo(notchX, bottomNotchY);
    context.arc(
      -insideX,
      bottomNotchY,
      dialRadius * 0.15,
      Math.PI,
      (3 * Math.PI) / 2,
      !counterClockwise
    );
    context.lineTo(-insideX, bottomCurveY);
    context.arc(0, bottomCurveY, insideX, Math.PI, 0, !counterClockwise);
    context.lineTo(insideX, bottomY);
    context.lineTo(outsideX, bottomY);
    context.fillStyle = "#c0c0c0";
    context.fill();

    context.stroke();
  }

  // draw lock body
  function drawLockBody(dialRadius) {
    const startAngle = (-3 * Math.PI) / 4;
    const endAngle = (5 * Math.PI) / 4;
    const counterClockwise = false;

    context.beginPath();
    context.arc(
      0,
      -dialRadius * 0.1,
      dialRadius * 1.2,
      startAngle,
      endAngle,
      counterClockwise
    );
    context.lineWidth = dialRadius * 0.03;
    context.strokeStyle = "black";
    context.fillStyle = "#c0c0c0";
    context.fill();
    context.stroke();

    // draw pointer thingy
    context.beginPath();
    context.lineWidth = dialRadius * 0.01;
    context.strokeStyle = "#e30000";
    context.moveTo(0, -dialRadius);
    context.lineTo(-dialRadius * 0.1, -dialRadius * 1.15);
    context.lineTo(dialRadius * 0.1, -dialRadius * 1.15);
    context.lineTo(0, -dialRadius);
    context.fillStyle = "#e30000";
    context.fill();
    context.stroke();
  }

  /* Given the 3 numbers in the combination, load the imageRots array with all the turns to open the lock correctly.
   * Then initiate the animation.
   */
  function openLock(number1, number2, number3, numTicks, stepByStep) {
    if (stepByStep) {
      mode = 'stepByStep';
    }

    imageRotations = [];

    imageRotations.push(ImageRotation(dialNumbersToRadians(numTicks), 1));
    imageRotations.push(ImageRotation(dialNumbersToRadians(numTicks), 1));
    imageRotations.push(
      ImageRotation(dialNumbersToRadians(numTicks - number1), 1)
    );

    // add turns to imageRots array to reach second number
    imageRotations.push(ImageRotation(dialNumbersToRadians(-numTicks), 2));
    if (number2 > number1) {
      imageRotations.push(
        ImageRotation(dialNumbersToRadians(-(number2 - number1)), 2)
      );
    } else {
      imageRotations.push(
        ImageRotation(dialNumbersToRadians(-numTicks + number1 - number2), 2)
      );
    }

    // add turn to imageRotations array to reach third number
    if (number2 > number3) {
      imageRotations.push(
        ImageRotation(dialNumbersToRadians(number2 - number3), 3)
      );
    } else {
      imageRotations.push(
        ImageRotation(dialNumbersToRadians(number2 + numTicks - number3), 3)
      );
    }

    // have the shackle open when the combination is completed
    shouldOpen = true;

    // initiate spinning animation
    rotateImage();
  }

  function nextStep() {
    rotateImage();
  }

  // Animate the dial rotating
  function rotateImage() {
    // No rotations to process, so exit immediately
    if (imageRotations.length === 0) {
      return;
    }
      
    // only repeat if the angle turned is less than the total angle to be turned
    var angleLeftToTurn =
      Math.abs(imageRotations[0].totalAngle) - imageRotations[0].angleTurned;

    var percentOfAngleTurned =
      imageRotations[0].angleTurned / Math.abs(imageRotations[0].totalAngle);
    var x = percentOfAngleTurned * Math.PI;
    var angleToTurnNow =
      ((speed / MEDIUM_TURN_SPEED) *
        (Math.sin(x + Math.PI / 12) + 0.5) *
        imageRotations[0].totalAngle) /
      90;

    if (angleLeftToTurn > 0) {
      // if still turning
      // must turn the standard amount or the remaining amount if less than the standard amount
      // must update the current angle for the rotated dial as well as the angleTurned for this rot object
      if (angleLeftToTurn < Math.abs(imageRotations[0].totalAngle) / 180) {
        if (imageRotations[0].totalAngle > 0) {
          currentAngle += angleLeftToTurn;
          imageRotations[0].angleTurned += angleLeftToTurn;
        } else {
          currentAngle -= angleLeftToTurn;
          imageRotations[0].angleTurned += angleLeftToTurn;
        }
      } else {
        // update the current angle for the rotated dial as well as the angleTurned for this rot object
        currentAngle += angleToTurnNow;
        imageRotations[0].angleTurned += Math.abs(angleToTurnNow);
      }

      clearCanvas();
      drawLock();

      // request new frame
      requestAnimFrame(function() {
        rotateImage();
      });
    } else {
      // if finished a turn but there are still additional turns to make
      if (imageRotations.length > 1) {
        // if in unlock mode, keep going
        if (mode === "unlock") {
          // remove the first rotation element in the array
          imageRotations.shift();

          // go on to the next turn after brief pause
          setTimeout(function() {
            requestAnimFrame(function() {
              rotateImage();
            });
          }, (1000 * MEDIUM_TURN_SPEED) / speed);
        } else if (imageRotations[0].number === imageRotations[1].number) {
          // in stepByStep, but same step number, so keep going
          // remove the first rotation element in the array
          imageRotations.shift();

          // go on to the next turn after brief pause
          setTimeout(function() {
            requestAnimFrame(function() {
              rotateImage();
            });
          }, (1000 * MEDIUM_TURN_SPEED) / speed);
        } else {
          // in stepByStep, but not the same step number, so remove rot element and wait for next click
          // remove the first rotation element in the array
          imageRotations.shift();
          onAnimationComplete();
        }
      } else if (mode === 'reset') {
        // finished with turns
        onResetComplete();
        mode = 'unlock';
      } else {
        // done opening lock
        imageRotations = [];
        if (shouldOpen && !shackleIsOpen) {
          // open shackle if completed combination
          openShackle(0);
          shackleIsOpen = true;
        }
      }
    }
  }

  // Open the shackle when combination is completed
  function openShackle(distanceOpened) {
    // zoom out so shackle doesn't open out of view
    if (radius > ORIGINAL_RADIUS * 0.75 && shouldOpen) {
      clearCanvas();

      //update the radius
      radius -= 0.01 * ORIGINAL_RADIUS;

      drawLock();

      // request new frame
      requestAnimFrame(function() {
        openShackle(distanceOpened);
      });
    } else if (distanceOpened < radius * 0.8 && shouldOpen) {
      clearCanvas();

      // draw the new image
      context.save();
      context.translate(0, -distanceOpened);
      drawShackle(radius);
      context.restore();

      distanceOpened += radius * 0.03;

      drawLockBody(radius);

      // draw the dial at the correct orientation
      context.save();
      context.rotate(currentAngle);
      drawDial(radius);
      context.restore();

      // request new frame
      requestAnimFrame(function() {
        openShackle(distanceOpened);
      });
    } else {
      onAnimationComplete();
    }
  }

  function reset() {
    if (mode === 'reset') {
      return;
    }
    shouldOpen = false;
    mode = 'reset';

    if (mode === "stepByStep" && (imageRotations.length === 1 || imageRotations.length === 3)) {
      imageRotations = [];
      imageRotations.push(ImageRotation(2 * Math.PI - currentAngle % (2 * Math.PI), 0));
      rotateImage();
    }
    else {
      imageRotations = [];
      imageRotations.push(ImageRotation(2 * Math.PI - currentAngle % (2 * Math.PI), 0));
      rotateImage();
      if (shackleIsOpen) {
        returnToOriginalSize();
      }
    }
  }

  // Zoom in to show the lock in the original size after a reset.
  function returnToOriginalSize() {
    if (radius < ORIGINAL_RADIUS) {
      // update the radius
      radius += 0.01 * ORIGINAL_RADIUS;

      // request new frame
      requestAnimFrame(function() {
        returnToOriginalSize();
      });
    } else {
      shackleIsOpen = false;
    }
  }

  function drawLock() {
    drawShackle(radius);
    drawLockBody(radius);

    context.save();
    context.rotate(currentAngle);

    drawDial(radius);

    context.restore();
  }

  return {
    drawLock,
    openLock,
    nextStep,
    reset,
    setSpeed,
    setNumbersOnDial
  };
}
