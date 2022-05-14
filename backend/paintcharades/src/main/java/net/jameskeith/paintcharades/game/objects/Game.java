package net.jameskeith.paintcharades.game.objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import net.jameskeith.paintcharades.game.GameController;
import net.jameskeith.paintcharades.game.GameService;
import net.jameskeith.paintcharades.player.objects.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Data
public class Game {
    @JsonIgnore
    int secondsAllowedToGuess;

    @JsonIgnore
    WordRequest wordToGuess;

    @JsonIgnore
    List<String> wordsGuessed;

    @JsonIgnore
    List<WordRequest> wordsToPickFrom;

    @JsonIgnore
    Integer currentPlayerIndex = -1;

    @JsonIgnore
    List<PlayerWordGuessCounter> playerWordGuessCounters;

    @JsonIgnore
    SimpMessageSendingOperations messagingTemplate;

    @JsonIgnore
    Map<String, Player> idToPlayerMap;

    @JsonIgnore
    GameService gameService;

    @JsonIgnore
    Timer timer;

    @JsonIgnore
    TimerTask newGameTimerTask;

    @JsonIgnore
    Boolean gameOver = true;

    String roomCode;
    LocalDateTime timeGameStarted;
    String currentState;
    Player currentPlayer;

    int timeRemaining = this.secondsAllowedToGuess;

    public Player getPlayer(String id) {
        if(idToPlayerMap.get(id) == null) {
            System.out.println("No player with ID " + id);
            return null;
        }
        return idToPlayerMap.get(id);
    }
    public void removePlayer(String id) {
        this.idToPlayerMap.remove(id);
    }
    public List<Player> getAllPlayers() {
        return idToPlayerMap.values().stream().toList();
    }
    public void addPlayer(String id, Player player) {
        this.idToPlayerMap.put(id, player);
    }

    public Game() {
        this.idToPlayerMap = new HashMap<>();
        this.timeGameStarted = LocalDateTime.now();
        this.wordsGuessed = new ArrayList<>();
    }

    public void setGameService(GameService gameService) {
        this.gameService = gameService;
    }

    public void play() {
        this.playerWordGuessCounters = new ArrayList<>();
        timeRemaining = this.secondsAllowedToGuess;
        this.gameOver = false;
        this.newGameTimerTask = new TimerTask() {
            @Override
            public void run() {
                timeRemaining -= 1;
                System.out.printf("Time remaining to guess word \"%s\" for game \"%s\" is %d seconds%n", wordToGuess.getWord(), roomCode, timeRemaining);
                gameService.notifyGameUpdate(roomCode);
                if(timeRemaining <= 0) {
                    System.out.printf("Game \"%s\": Game over!%n", roomCode);
                    endRound();
                }
            }
        };
        timer = new Timer();

        timer.scheduleAtFixedRate(newGameTimerTask, 0, 1000);
    }

    public void pickWord(WordRequest wordRequest) {
        this.wordToGuess = wordRequest;
    }

    public void addPlayerCorrectGuess(Player playerThatGuessedCorrectly) {
        PlayerWordGuessCounter wordGuessCounter = new PlayerWordGuessCounter();
        wordGuessCounter.setPlayer(playerThatGuessedCorrectly);
        wordGuessCounter.setSecondsTakenToGuess(this.secondsAllowedToGuess - timeRemaining);
        playerThatGuessedCorrectly.setScore((playerThatGuessedCorrectly.getScore() + (int)((wordGuessCounter.getSecondsTakenToGuess() / this.secondsAllowedToGuess) * wordToGuess.getPoints())));
        currentPlayer.setScore(currentPlayer.getScore() + wordToGuess.getPoints());
        playerWordGuessCounters.add(wordGuessCounter);

        gameService.notifyGameAlert(roomCode, String.format("%s guessed the word in %f seconds!.", playerThatGuessedCorrectly.getName(), wordGuessCounter.getSecondsTakenToGuess()));

        if(playerWordGuessCounters.size() == getAllPlayers().size() - 1) {
            endRound();
        }
    }

    private void endRound() {
        this.gameOver = true;
        gameService.sendMessageToGameChat(roomCode, String.format("Round over! The word was \"%s\".", wordToGuess));
        newGameTimerTask.cancel();
        timer.cancel();
        timer = new Timer();
        this.timer.scheduleAtFixedRate(new TimerTask() {
            int delay = 5;
            @Override
            public void run() {
                delay -= 1;
                if(delay <= 0) {
                    timer.cancel();

                    Player highestScorePlayer = getAllPlayers().stream().sorted().collect(Collectors.toList()).get(0);

                    if(currentPlayerIndex == getAllPlayers().size() - 1) {
                        currentPlayerIndex = -1;
                        gameService.sendMessageToGameChat(roomCode, "Game over! And the winner is..." + highestScorePlayer.getName() + " with " + highestScorePlayer.getScore() + " points!");
                        setGameState("LOBBY");
                        getAllPlayers().forEach(player -> {
                            player.setScore(0);
                        });
                    } else {
                        gameService.sendMessageToGameChat(roomCode, "So far the leader is " + highestScorePlayer.getName() + " with " + highestScorePlayer.getScore() + " points!");
                        setGameState("PICK_WORD");
                    }
                }
            }
        }, 0, 1000);
    }

    public boolean setGameState(String state) {
        switch (state.toUpperCase()) {
            case "PLAY":
                this.setCurrentState("PLAY");
                this.play();
                break;
            case "PICK_WORD":
                pickWord();
                break;
            case "END_GAME":
                this.setCurrentState("END_GAME");
                break;
            case "LOBBY":
                this.setCurrentState("LOBBY");
                break;
            default:
                //Nothing
                return false;
        }
        gameService.notifyGameUpdate(roomCode);
        return true;
    }

    private void pickWord() {
        this.setNextPlayer();
        gameService.sendMessageToGameChat(roomCode, currentPlayer.getName() + " is now choosing a word...");
        this.setCurrentState("PICK_WORD");
    }

    public void setNextPlayer() {
        if(currentPlayerIndex < (this.getAllPlayers().size() - 1)) {
            currentPlayerIndex++;
        } else {
            currentPlayerIndex = 0;
        }
        this.currentPlayer = this.getAllPlayers().get(currentPlayerIndex);
        gameService.notifyGameUpdate(roomCode);
    }

    public boolean handleMessageDuringPlay(String message, Player playerSendingMessage) {
        if(this.getCurrentState() != null && this.getCurrentState().equalsIgnoreCase("PLAY")) {
            if (message.trim().toLowerCase().equals(this.getWordToGuess().getWord().trim().toLowerCase())) {
                if(playerSendingMessage.getName().equalsIgnoreCase(currentPlayer.getName())) {
                    gameService.sendMessageToGameChat(roomCode, playerSendingMessage.getName() + " is trying to tell everyone the word! Look really hard at the drawing!");
                } else {
                    boolean playerHasAlreadyGuessedWord = this.getPlayerWordGuessCounters().stream().anyMatch(playerWordGuessCounter -> playerWordGuessCounter.getPlayer().getName().equalsIgnoreCase(playerSendingMessage.getName()));

                    if (playerHasAlreadyGuessedWord) {
                        gameService.sendMessageToGameChat(roomCode, playerSendingMessage.getName() + " has already guessed the word and keeps trying to guess it again!");
                    } else {
                        if(this.gameOver){
                            gameService.sendMessageToGameChat(roomCode, playerSendingMessage.getName() + " guessed the word, but it is too late!");
                        } else {
                            this.addPlayerCorrectGuess(playerSendingMessage);
                            gameService.sendMessageToGameChat(roomCode, playerSendingMessage.getName() + " correctly guessed the word!");
                        }

                    }
                }

                return true;
            }
        }
        return false;
    }
}
