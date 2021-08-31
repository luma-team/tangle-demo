import _ from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { TangleStore, useTangle } from "../utils/TangleStore";

const COLORS = [
  "gray",
  "cranberry",
  "barney",
  "purple",
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
] as const;
const NUM_CELLS = 2000;
const NUM_COLS = 40;

type HighlightEvent = {
  type: `highlight-${number}`;
  idx: number;
  color: typeof COLORS[number];
};
const HighlightStore = new TangleStore<HighlightEvent>();

// For recording the GIF
const INITIAL_DELAY = 0;
const NUM_ITERATIONS = Infinity;

const Home: NextPage = () => {
  useEffect(() => {
    let iterations = 0;
    setTimeout(() => {
      setInterval(() => {
        const randomIndex = Math.floor(Math.random() * NUM_CELLS);

        // Only for recording the demo
        if (iterations > NUM_ITERATIONS) {
          return;
        }
        iterations++;

        HighlightStore.dispatchEvent({
          type: `highlight-${randomIndex}`,
          idx: randomIndex,
          color: _.sample(COLORS) as typeof COLORS[number],
        });

        setTimeout(() => {
          HighlightStore.dispatchEvent({
            type: `highlight-${randomIndex}`,
            idx: randomIndex,
            color: "gray",
          });
        }, 600);
      }, 10);
    }, INITIAL_DELAY);
  }, []);

  return (
    <div>
      <Head>
        <title>Tangle</title>
        <meta
          name="description"
          content="Event driven state changes in React."
        />
      </Head>

      <div className="container">
        <h3>Tangle</h3>
        <p>
          Event driven state changes in React.{" "}
          <a
            href={"https://github.com/luma-team/tangle-demo"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            GitHub
          </a>
          .
        </p>

        <InputBox />

        <div className={"grid-container"}>
          <Grid />
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 1rem;
        }

        .grid-container {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

const InputBox = () => {
  const [inputVal, setInputVal] = useState("");

  return (
    <div>
      <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
    </div>
  );
};

const range = (i: number): number[] => {
  return [...Array(i).keys()];
};

const Grid = () => {
  return (
    <div className="grid">
      {range(NUM_CELLS).map((i) => (
        <Cell key={i} idx={i} />
      ))}

      <style jsx>{`
        .grid {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};

const Cell = ({ idx }: { idx: number }) => {
  const [color, setColor] = useState("gray");

  useTangle({
    store: HighlightStore,
    eventName: `highlight-${idx}`,
    handleEvent: (event) => {
      setColor(event.color);
    },
  });

  return (
    <div key={idx} className={"cell"}>
      <style jsx>{`
        .cell {
          width: 20px;
          height: 20px;
          background-color: var(--${color});
          border-radius: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          margin-bottom: 4px;
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
};

export default Home;
