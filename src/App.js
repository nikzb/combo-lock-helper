import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
import { Input, Slider, Label } from "@rebass/forms";
import { Box, Flex, Heading, Button, Text } from "rebass";

import { lock } from "./lock";

const INPUT_WIDTH = 70;

const lockHelperMachine = Machine({
  id: "lock-helper",
  initial: "start",
  context: {
    step: 0,
    animating: false
  },
  states: {
    start: {
      on: {
        UNLOCK: {
          target: "unlocking",
          actions: assign({
            animating: true
          })
        },
        STEP_BY_STEP: {
          target: "steppingActive",
          actions: assign({
            step: 1,
            animating: true
          })
        }
      }
    },
    unlocking: {
      on: {
        RESET: {
          target: "resetting",
          actions: assign({
            animating: true
          })
        }
      }
    },
    resetting: {
      on: {
        DONE: {
          target: "start",
          actions: assign({
            animating: false
          })
        }
      }
    },
    steppingActive: {
      on: {
        DONE: {
          target: "steppingIdle"
        },
        RESET: {
          target: "resetting",
          actions: assign({
            step: 0,
          })
        }
      }
    },
    steppingIdle: {
      on: {
        // Needs a guard to prevent from happening after 3 steps are done?
        NEXT_STEP: {
          target: "steppingActive",
          actions: assign({
            step: (context, event) => (context.step < 3 ? context.step + 1 : 3),
          })
        },
        RESET: {
          target: "resetting",
          actions: assign({
            step: 0,
          })
        }
      }
    }
  }
});

function App() {
  const [speed, setSpeed] = React.useState(50);
  const [numbersOnDial, setNumbersOnDial] = React.useState(40);
  const [firstNumber, setFirstNumber] = React.useState(10);
  const [secondNumber, setSecondNumber] = React.useState(25);
  const [thirdNumber, setThirdNumber] = React.useState(20);

  const [currentState, send] = useMachine(lockHelperMachine);

  const canvasRef = React.useRef(null);
  const lockRef = React.useRef(null);

  React.useEffect(() => {
    const onResetComplete = () => send("DONE");
    const onAnimationComplete = () => send("DONE");
    if (lockRef.current) {
      lockRef.current.setNumbersOnDial(numbersOnDial);
    } else {
      lockRef.current = lock(canvasRef.current, numbersOnDial, onResetComplete, onAnimationComplete);
    }
    lockRef.current.drawLock();
  }, [numbersOnDial, send]);

  React.useEffect(() => {
    if (lockRef.current) {
      lockRef.current.setSpeed(speed);
    }
  }, [speed]);

  const numberIsValid = num => num >= 0 && num < numbersOnDial;

  const combinationIsValid = numberIsValid(firstNumber) && numberIsValid(secondNumber) && numberIsValid(thirdNumber);

  // Certain controls must be disabled while the unlocking or step by step processes are in progress
  const disableControls = !currentState.matches('start');

  const onUnlock = () => {
    if (lockRef.current && combinationIsValid) {
      send("UNLOCK");
      lockRef.current.openLock(
        firstNumber,
        secondNumber,
        thirdNumber,
        numbersOnDial
      );
    }
  };

  const onStepByStep = () => {
    if (lockRef.current && combinationIsValid) {
      send("STEP_BY_STEP");
      const stepByStep = true;
      lockRef.current.openLock(
        firstNumber,
        secondNumber,
        thirdNumber,
        numbersOnDial,
        stepByStep 
      );
    }
  };

  const onNextStep = () => {
    if (lockRef.current) {
      send("NEXT_STEP");
      lockRef.current.nextStep();
    }
  }

  const onReset = () => {
    if (lockRef.current) {
      send("RESET");
      lockRef.current.reset();
    }
  };

  const getButtons = () => {
    let buttons;
    let justify;

    if (currentState.matches("start")) {
      buttons = (
        <>
          <Button variant="primary" width="2/5" onClick={onUnlock}>
            Unlock
          </Button>
          <Button variant="primary" width="2/5" onClick={onStepByStep}>
            Step By Step
          </Button>
        </>
      );
      justify = "space-between";
    } else if (
      currentState.matches("unlocking") ||
      currentState.matches("resetting")
    ) {
      buttons = (
        <Button
          variant={currentState.matches("resetting") ? "secondaryOutline" : "secondary"}
          width="2/5"
          onClick={onReset}
          disabled={currentState.matches("resetting")}
        >
          Reset
        </Button>
      );
      justify = "center";
    } else if (currentState.matches("steppingActive") || currentState.matches("steppingIdle")) {
      buttons = (
        <>
          <Button variant="secondary" width="2/5" onClick={onReset}>
            Reset
          </Button>
          {currentState.context.step < 3 && 
          <Button
            variant={currentState.matches("steppingActive") ? "outline" : "primary"}
            width="2/5"
            onClick={onNextStep}
            disabled={currentState.matches("steppingActive")}
          >
            Next Step
          </Button>
          }
        </>
      );
      justify = currentState.context.step < 3 ? "space-between" : 'center';
    }

    return (
      <Flex width="230px" justifyContent={justify}>
        {buttons}
      </Flex>
    );
  };

  return (
    <Flex flexDirection="column" alignItems="center">
      <Heading
        as="h1"
        color="primary"
        fontSize={5}
        fontFamily="sans-serif"
        p={3}
        // sx={{
        //   padding: "20px"
        // }}
      >
        Combo Lock Helper
      </Heading>
      <canvas ref={canvasRef} width={280} height={360} style={{ marginBottom: '10px' }} />
      <Flex
        as="form"
        onSubmit={e => e.preventDefault()}
        flexDirection="column"
        alignItems="center"
        width={`${INPUT_WIDTH * 3}px`}
      >
        <fieldset style={{ border: "none" }}>
          <Text as="legend" fontFamily="sans-serif">Enter the combination:</Text>
          <Flex>
            <Input
              required
              id="first-number"
              name="first-number"
              aria-label="First Number in the Combination"
              type="number"
              min={0}
              max={numbersOnDial - 1}
              placeholder={10}
              value={firstNumber}
              onClick={e => e.target.select()}
              onChange={e => setFirstNumber(Number(e.target.value))}
              disabled={disableControls}
              backgroundColor={currentState.matches('start') ? "#FFF" : "#EEE"}
              width={`${INPUT_WIDTH}px`}
              mx={1}
            />
            <Input
              required
              id="second-number"
              name="second-number"
              aria-label="Second Number in the Combination"
              type="number"
              min={0}
              max={numbersOnDial - 1}
              placeholder={25}
              value={secondNumber}
              onClick={e => e.target.select()}
              onChange={e => setSecondNumber(Number(e.target.value))}
              disabled={disableControls}
              backgroundColor={currentState.matches('start') ? "#FFF" : "#EEE"}
              width={`${INPUT_WIDTH}px`}
              mx={1}
            />
            <Input
              required
              id="third-number"
              name="third-number"
              aria-label="Third Number in the Combination"
              type="number"
              min={0}
              max={numbersOnDial - 1}
              placeholder={20}
              value={thirdNumber}
              onClick={e => e.target.select()}
              onChange={e => setThirdNumber(Number(e.target.value))}
              disabled={disableControls}
              backgroundColor={currentState.matches('start') ? "#FFF" : "#EEE"}
              width={`${INPUT_WIDTH}px`}
              mx={1}
            />
          </Flex>
        </fieldset>
        {getButtons()}
        <Flex
          width="330px"
          justifyContent="space-between"
          sx={{
            padding: "20px"
          }}
        >
          <Box>
            <Label htmlFor="speed" fontFamily="sans-serif">Speed</Label>
            <Slider
              id="speed"
              name="speed"
              defaultValue={50}
              step={5}
              min={10}
              max={90}
              onChange={e => { 
                setSpeed(Number(e.target.value))
              }}
            />
          </Box>
          <Box>
            <Label htmlFor="numbers-on-dial" fontFamily="sans-serif" color={disableControls ? '#888' : '#000'}>#s on Dial</Label>
            <Slider
              id="numbers-on-dial"
              name="numbers-on-dial"
              defaultValue={40}
              step={10}
              min={30}
              max={100}
              onChange={e => setNumbersOnDial(Number(e.target.value))}
              disabled={disableControls}
            />
          </Box>
        </Flex>
      </Flex>
      <Text fontSize={1} fontFamily="sans-serif">© 2019 Nik Baltatzis</Text>
    </Flex>
  );
}

export default App;
