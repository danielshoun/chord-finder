import guitarData, {ChordData, PositionData} from '../../data/guitar';
import {useEffect, useState} from "react";
// @ts-ignore
import Chord from '@tombatossals/react-chords/lib/Chord';
import {Box, FormControl, InputLabel, MenuItem, Select, styled, Typography} from "@mui/material";

const ContentRoot = styled(Box)(
  ({theme}) => `
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin: 0 auto;
    padding: 16px;
  `
);

const StyledSelect = styled(Select)(
  ({theme}) => `
    margin: ${theme.spacing(2)};
    min-width: 200px;
  `
);

const FingeringChoicesContainer = styled(Box)(
  ({theme}) => `
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  `
);

const ChordContainer = styled(Box)(
  ({theme}) => `
    max-height: 200px;
    max-width: 200px;
    margin: ${theme.spacing(2)};

    :hover {
      cursor: pointer;
    }
  `
);

const SelectedChordContainer = styled(Box)(
  ({theme}) => `
    max-height: 200px;
    max-width: 200px;
    margin: ${theme.spacing(2)};
    border: 1px solid ${theme.palette.primary.main};
    border-radius: 5%;

    :hover {
      cursor: pointer;
    }
  `
);

const Hello = () => {
  const instrument = {...guitarData.main, tunings: guitarData.tunings}
  const rootChoices = guitarData.keys;
  const [startingRootChoice, setStartingRootChoice] = useState('');
  const [destRootChoice, setDestRootChoice] = useState('');
  const [startingSuffixChoices, setStartingSuffixChoices] = useState([]);
  const [destSuffixChoices, setDestSuffixChoices] = useState([]);
  const [startingSuffixChoice, setStartingSuffixChoice] = useState('');
  const [destSuffixChoice, setDestSuffixChoice] = useState('');
  const [fingeringChoices, setFingeringChoices] = useState([]);
  const [fingeringChoice, setFingeringChoice] = useState(-1);
  const [closestFingering, setClosestFingering] = useState();

  useEffect(() => {
    // @ts-ignore
    const chordDataList = guitarData.chords[startingRootChoice];
    if (chordDataList) {
      setStartingSuffixChoices(chordDataList.map((chord: ChordData) => chord.suffix))
    }
  }, [startingRootChoice]);

  useEffect(() => {
    // @ts-ignore
    const chordDataList = guitarData.chords[startingRootChoice];
    if (chordDataList) {
      const chordData = chordDataList.find((chord: ChordData) => chord.suffix === startingSuffixChoice);
      if (chordData) {
        setFingeringChoice(-1);
        setFingeringChoices(chordData.positions);
      }
    }
  }, [startingRootChoice, startingSuffixChoice])

  useEffect(() => {
    // @ts-ignore
    const chordDataList = guitarData.chords[destRootChoice];
    if (chordDataList) {
      setDestSuffixChoices(chordDataList.map((chord: ChordData) => chord.suffix))
    }
  }, [destRootChoice]);

  useEffect(() => {
    if (fingeringChoice > -1) {
      const startingFingering = fingeringChoices[fingeringChoice];
      console.log(startingFingering);
      // @ts-ignore
      const chordDataList = guitarData.chords[destRootChoice];
      if (chordDataList) {
        const possibleDestinations = chordDataList.find((chord: ChordData) => chord.suffix === destSuffixChoice)?.positions;
        if (possibleDestinations) {
          const averageDistances = [];
          possibleDestinations.forEach((fingering: PositionData) => {
            const distances = [];
            fingering.frets.forEach((fret: number, i: number) => {
              if ((fret !== -1) && (startingFingering.frets[i] !== -1)) {
                distances.push(Math.abs((fret + fingering.baseFret) - (startingFingering.frets[i] + startingFingering.baseFret)));
              }
            })
            const distanceSum = distances.reduce((partialSum: number, a: number) => partialSum + a, 0);
            averageDistances.push(distanceSum / distances.length);
          })
          const minAverage = Math.min(...averageDistances);
          const closestIndex = averageDistances.indexOf(minAverage);
          setClosestFingering(possibleDestinations[closestIndex]);
        }
      }
    }
  }, [fingeringChoice, destRootChoice, destSuffixChoice])

  return (
    <ContentRoot>
      <FormControl>
        <InputLabel>Starting Chord Root</InputLabel>
        <StyledSelect
          value={startingRootChoice}
          onChange={(e) => setStartingRootChoice(e.target.value)}
        >
          {rootChoices.map(rootChoice => {
            return (
              <MenuItem key={rootChoice} value={rootChoice}>{rootChoice}</MenuItem>
            )
          })}
        </StyledSelect>
      </FormControl>
      <FormControl>
        <InputLabel>Starting Chord Suffix</InputLabel>
        <StyledSelect
          value={startingSuffixChoice}
          disabled={startingSuffixChoices.length === 0}
          onChange={(e) => setStartingSuffixChoice(e.target.value)}
        >
          {startingSuffixChoices.map(suffixChoice => {
            return (
              <MenuItem key={suffixChoice} value={suffixChoice}>{suffixChoice}</MenuItem>
            )
          })}
        </StyledSelect>
      </FormControl>
      {fingeringChoices.length > 0 && (
        <>
          <Typography>Select a starting fingering...</Typography>
          <FingeringChoicesContainer>
            {fingeringChoices.map((fingering: PositionData, index: number) => {
              return (
                fingeringChoice === index ? (
                  <SelectedChordContainer>
                    <Chord
                      chord={fingering}
                      instrument={instrument}
                    />
                  </SelectedChordContainer>
                ) : (
                  <ChordContainer onClick={() => {
                    setDestRootChoice('');
                    setDestSuffixChoice('');
                    setClosestFingering(undefined);
                    setFingeringChoice(index)
                  }}>
                    <Chord
                      chord={fingering}
                      instrument={instrument}
                    />
                  </ChordContainer>
                )
              )
            })}
          </FingeringChoicesContainer>
          {fingeringChoice !== -1 && (
            <>
              <FormControl>
                <InputLabel>Destination Chord Root</InputLabel>
                <StyledSelect
                  value={destRootChoice}
                  onChange={(e) => setDestRootChoice(e.target.value)}
                >
                  {rootChoices.map(rootChoice => {
                    return (
                      <MenuItem key={rootChoice} value={rootChoice}>{rootChoice}</MenuItem>
                    )
                  })}
                </StyledSelect>
              </FormControl>
              <FormControl>
                <InputLabel>Destination Chord Suffix</InputLabel>
                <StyledSelect
                  value={destSuffixChoice}
                  disabled={destSuffixChoices.length === 0}
                  onChange={(e) => setDestSuffixChoice(e.target.value)}
                >
                  {destSuffixChoices.map(suffixChoice => {
                    return (
                      <MenuItem key={suffixChoice} value={suffixChoice}>{suffixChoice}</MenuItem>
                    )
                  })}
                </StyledSelect>
              </FormControl>
              {closestFingering && (
                <ChordContainer onClick={() => setFingeringChoice(index)}>
                  <Chord
                    chord={closestFingering}
                    instrument={instrument}
                  />
                </ChordContainer>
              )}
            </>
          )}
        </>
      )}
    </ContentRoot>
  );
};

export default Hello;
