const OPTIMAL_CONNECTED_PEERS = 200
const OPTIMAL_POPULATION = 100_000
const OPTIMAL_DEPTH = 12

interface Threshold {
  minimumValue: number
  explanation: string
  score: number
}

type Thresholds = {
  connectedPeers: Threshold[]
  population: Threshold[]
  depth: Threshold[]
}

type ThresholdValue = {
  score: number
  maximumScore: number
  explanation: string
}

export type ThresholdValues = {
  connectedPeers: ThresholdValue
  population: ThresholdValue
  depth: ThresholdValue
}

const GENERIC_ERROR = 'There may be issues with your Node or connection.'

const THRESHOLDS: Thresholds = {
  connectedPeers: [
    {
      minimumValue: OPTIMAL_CONNECTED_PEERS,
      explanation: `Perfect! ${OPTIMAL_CONNECTED_PEERS} or more connected peers indicate a healthy topology.`,
      score: 2,
    },
    {
      minimumValue: 1,
      explanation: `Your Node is connected to peers, but this number should ideally be above ${OPTIMAL_CONNECTED_PEERS}. If you have only started your Node, this number may increase quickly.`,
      score: 1,
    },
    {
      minimumValue: 0,
      explanation: 'Your Node has not connected to any peers. ' + GENERIC_ERROR,
      score: 0,
    },
  ],
  population: [
    {
      minimumValue: OPTIMAL_POPULATION,
      explanation:
        'Perfect! Your Node seems to have a realistic value for the network size, which means everything is working well on your end.',
      score: 2,
    },
    {
      minimumValue: 1,
      explanation: `Population is usually above ${OPTIMAL_POPULATION.toLocaleString()}. If the number does not increase within a few hours, there may be issues with your Node.`,
      score: 1,
    },
    {
      minimumValue: 0,
      explanation: 'Your Node has no information on the network population. ' + GENERIC_ERROR,
      score: 0,
    },
  ],
  depth: [
    {
      minimumValue: OPTIMAL_DEPTH,
      explanation: 'Perfect! Your Node has the highest available depth.',
      score: 2,
    },
    {
      minimumValue: 1,
      explanation: `Your Node is supposed to reach a depth of ${OPTIMAL_DEPTH} eventually. Stagnation or decrease in this number may indicate problems with your Node.`,
      score: 1,
    },
    { minimumValue: 0, explanation: 'Your Node has not started building its topology yet. ' + GENERIC_ERROR, score: 0 },
  ],
}

export function pickThreshold(key: keyof Thresholds, value: number): ThresholdValue {
  const thresholds = THRESHOLDS[key]
  const maximumScore = thresholds[0].score
  for (const item of thresholds) {
    if (value >= item.minimumValue) {
      return {
        score: item.score,
        maximumScore,
        explanation: item.explanation,
      }
    }
  }
  throw Error(`Could not find any threshold for ${key} with value ${value}`)
}
