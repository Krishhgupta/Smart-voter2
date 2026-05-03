import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useElectionStore = create(
  persist(
    (set) => ({
      hasVoted: false,
      selectedCandidate: null,
      quizScore: null,
      
      castVote: (candidate) => set({ hasVoted: true, selectedCandidate: candidate }),
      resetVote: () => set({ hasVoted: false, selectedCandidate: null }),
      setQuizScore: (score) => set({ quizScore: score }),
    }),
    {
      name: 'election-storage', // unique name for localStorage
    }
  )
);

export default useElectionStore;
