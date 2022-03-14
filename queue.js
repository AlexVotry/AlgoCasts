import React, { useState, useContext, useEffect } from 'react';
import socket from './socketConnection';
import { find, remove, isEqual, isEmpty, set } from 'lodash';
import { assignTeam } from '../service/parseTeams';
import { newMap } from '../service/strings';
import { resetAnswersAndScores } from '../service/reset';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import LetterContext from '../contexts/LetterContext';
import CategoryContext from '../contexts/CategoryContext';
import TimerContext from '../contexts/TimerContext';
import GameStateContext from '../contexts/GameStateContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import TeamScoreContext from '../contexts/TeamScoreContext';
import { updateUserAnswers } from './updateAnswers';

function WebSocketUtility() {
  const localState = {};
  const [teams, setTeams] = useState({});
  const [prevTeams, setprevTeams] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const [user, setUser] = useState(localState);
  const [userPrev, setUserPrev] = useState({});
  const [gameState, setGameState] = useState('ready');
  const [prevGameState, setprevGameState] = useState('');
  const [timer, setTimer] = useState(0);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [prevFinalAnswers, setPrevFinalAnswers] = useState({ empty: 0 });
  const [userAnswers, setUserAnswers] = useState(new Map());

  const update = user => setUser(user);
  const updateUA = answers => setUserAnswers(answers);
  // const updateScore = teamScore => setTeamScore(teamScore);
  // const divvyTeams = teams => this.setState({ teams });

  useEffect(() => {
    updateUser();
  }, [user]);

  // const initialize = () => {

  function updateUser() {
    if (!isEqual(user, userPrev)) {
      socket.on('currentUser', newUser => {
        console.log('NewUser', newUser, user);
        if (!isEmpty(newUser)) {
          setUser(newUser);
          setUserPrev(newUser);
        }
      })
    }
  }
  socket.on('initUser', info => {
    setUser(info.currentUser);
    setMyTeam(user.team);
    setTeams(info.teams)
  });



  socket.on('newGame', gameInfo => {
    setCategories(gameInfo.categories);
    setCurrentLetter(gameInfo.currentLetter);
  });

  if (!isEqual(prevTeams, teams)) {
    setprevTeams(teams);

    socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      console.log('user:', user)
      const team = !isEmpty(user) ? assignTeam(newTeams, user) : null;
      const newUser = { ...user, team };
      localStorage.removeItem('userInfo');
      setUser(newUser);
      console.log(newUser);
      setMyTeam(team);
      localStorage.setItem('userInfo', JSON.stringify(newUser));
    }).emit('myTeam', user.team);
  }

  if (!isEqual(prevGameState, gameState)) {
    setprevGameState(gameState);
    socket.on('gameState', gameState => {
      setGameState(gameState);
    });
  }

  socket.on('Clock', clock => {
    setTimer(clock);
  });

  if (!isEqual(prevFinalAnswers, finalAnswers)) {
    socket.on('AllSubmissions', finalSubmissions => {
      const teamArray = Object.keys(finalSubmissions);
      setGameState('ready');

      teamArray.forEach(team => {
        finalSubmissions[team].answers = newMap(finalSubmissions[team].answers);
      })
      setFinalAnswers(finalSubmissions);
    });
  }

  if (!isEqual(prevFinalAnswers, finalAnswers)) {
    socket.on('startOver', numOfCategories => {
      const answerMap = resetAnswersAndScores(numOfCategories);
      const teamArray = Object.keys(teams);
      let finalSubs = {};
      teamArray.forEach(team => {
        finalSubs = { ...finalSubs, [team]: { answers: answerMap, score: 0 } }
      });
      setFinalAnswers(finalSubs);
      setGameState('ready');
    })
  }

  return (
    <UserContext.Provider value={{ user, update }}>
      <TeamsContext.Provider value={teams}>
        <CategoryContext.Provider value={categories}>
          <LetterContext.Provider value={currentLetter}>
            <TimerContext.Provider value={timer}>
              <GameStateContext.Provider value={gameState}>
                <FinalAnswersContext.Provider value={finalAnswers}>
                  <TeamScoreContext.TeamScoreProvider>
                    <UserAnswersContext.Provider value={{ userAnswers, updateUA }}>
                      <App myTeam={myTeam} />
                    </UserAnswersContext.Provider>
                  </TeamScoreContext.TeamScoreProvider>
                </FinalAnswersContext.Provider>
              </GameStateContext.Provider>
            </TimerContext.Provider>
          </LetterContext.Provider>
        </CategoryContext.Provider>
      </TeamsContext.Provider>
    </UserContext.Provider>
  )

}

export default WebSocketUtility;