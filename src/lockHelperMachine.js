import { Machine, assign } from "xstate";

export const lockHelperMachine = Machine({
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
          target: "stepping",
          actions: assign({
            step: 1,
            animating: true
          })
        }
      }
    },
    unlocking: {
      on: {
        ROTATION_DONE: {
          target: "unshackling"
        },
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
        RESET_DONE: {
          target: "start",
          actions: assign({
            animating: false
          })
        }
      }
    },
    stepping: {
      initial: "active",
      states: {
        active: {
          on: {
            ROTATION_DONE: {
              target: "idle",
              cond: (context) => (context.step < 3)
            },
          }
        },
        idle: {
          on: {
            // Needs a guard to prevent from happening after 3 steps are done?
            NEXT_STEP: {
              target: "active",
              actions: assign({
                step: (context, event) => (context.step < 3 ? context.step + 1 : 3),
              })
            }
          }
        }
      },
      on: {
        RESET: {
          target: "resetting",
          actions: assign({
            step: 0,
          })
        },
        ROTATION_DONE: {
          target: "unshackling"
        }
      }
    },
    unshackling: {
      initial: "active",
      states: {
        active: {
          on: { 
            SHACKLE_DONE: {
              target: "idle"
            }
          }
        },
        idle: {
        }
      },
      on: {
        RESET: {
          target: "resetting",
        }
      }
    }
  }
});
