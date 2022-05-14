package net.jameskeith.paintcharades.game;

import net.jameskeith.paintcharades.chat.objects.ChatMessage;
import net.jameskeith.paintcharades.game.objects.Game;
import net.jameskeith.paintcharades.game.objects.WordRequest;
import net.jameskeith.paintcharades.login.objects.LoginRequest;
import net.jameskeith.paintcharades.login.objects.LoginResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {
    @Value("${game.points.easy}")
    int EASY_POINTS;

    @Value("${game.points.medium}")
    int MEDIUM_POINTS;

    @Value("${game.points.hard}")
    int HARD_POINTS;

    @Value("${game.time.round}")
    int SECONDS_ALLOWED_TO_GUESS; // TODO: This needs a better home...

    @Value("${game.wordlist.filename}")
    String wordlistFilename;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    List<String> easyWords = new ArrayList<>();
    List<String> mediumWords = new ArrayList<>();
    List<String> hardWords = new ArrayList<>();

    private Map<String, Game> roomCodeToGameMap = new HashMap<>();

    public GameService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostConstruct
    public void init() {
        try {
            generateWordChoices();
        } catch (Exception e) {
            System.out.println("Failed to read lines from file.");
        }
    }

    public Game getGameFromRoomCode(String roomCode) {
        return roomCodeToGameMap.get(roomCode);
    }

    public void setGameFromRoomCode(String roomCode, Game game) {
         roomCodeToGameMap.put(roomCode, game);
    }

    public void deleteGame(String roomCode) {
        roomCodeToGameMap.remove(roomCode);
    }

    public List<WordRequest> getWordsToChoose(String roomCode) {
        List<WordRequest> wordsToGiveUser = new ArrayList<>();
        Random random = new Random();
        Game currentGame = getGameFromRoomCode(roomCode);
        WordRequest easyWord = getWordRequest(currentGame, easyWords, "Easy", EASY_POINTS, random);
        WordRequest mediumWord = getWordRequest(currentGame, mediumWords, "Medium", MEDIUM_POINTS, random);
        WordRequest hardWord = getWordRequest(currentGame, hardWords, "Hard", HARD_POINTS, random);

        if(easyWord != null) {
            wordsToGiveUser.add(easyWord);
        }

        if(mediumWord != null) {
            wordsToGiveUser.add(mediumWord);
        }

        if(hardWord != null) {
            wordsToGiveUser.add(hardWord);
        }

        return wordsToGiveUser;
    }

    private WordRequest getWordRequest(Game currentGame, List<String> words, String difficulty, int points, Random random) {
        List<String> wordsNotChosen = words.stream().filter(word -> !currentGame.getWordsGuessed().contains(word)).collect(Collectors.toList());
        if(wordsNotChosen.size() > 0) {
            int randomWordIndex = random.nextInt(wordsNotChosen.size());
            WordRequest wordRequest = new WordRequest();
            wordRequest.setDifficulty(difficulty);
            wordRequest.setPoints(points);
            wordRequest.setWord(StringUtils.capitalize(wordsNotChosen.get(randomWordIndex)));
            return wordRequest;
        } else {
            return null;
        }
    }

    public void notifyGameUpdate(String roomCode) {
        messagingTemplate.convertAndSend("/topic/game/" + roomCode, this.getGameFromRoomCode(roomCode));
    }

    public void notifyGameAlert(String roomCode, String alert) {
        messagingTemplate.convertAndSend("/topic/alert/" + roomCode, alert);
    }

    public void sendMessageToGameChat(String roomCode, String message) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setUsername("System");
        chatMessage.setIcon("paint_lg");
        chatMessage.setMessage(message);
        messagingTemplate.convertAndSend("/topic/chat/" + roomCode,  chatMessage);
    }

    private void generateWordChoices() throws IOException {
        List<String> listOfStrings = getListOfWordsFromFile(wordlistFilename);

        System.out.println("Loaded " + listOfStrings.size() + " nouns from file");

        easyWords = listOfStrings.stream().filter(word -> !word.contains("-") && word.length() <= 4).collect(Collectors.toList());
        System.out.println(easyWords.size() + " are easy words");

        mediumWords = listOfStrings.stream().filter(word -> !word.contains("-") && word.length() > 4 && word.length() < 7).collect(Collectors.toList());
        System.out.println(mediumWords.size() + " are medium words");

        hardWords = listOfStrings.stream().filter(word -> !word.contains("-") && word.length() >= 7).collect(Collectors.toList());
        System.out.println(hardWords.size() + " are hard words");
    }

    private List<String> getListOfWordsFromFile(String wordlistFilename) throws IOException {
        List<String> listOfStrings
                = new ArrayList<>();

        BufferedReader bf = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(this.getClass().getResourceAsStream(wordlistFilename))));

        String line = bf.readLine();
        while (line != null) {
            listOfStrings.add(line);
            line = bf.readLine();
        }

        bf.close();

        return listOfStrings;
    }

    public List<WordRequest> getWordsToChooseFrom(boolean isFirstRequest, String roomCode) {
        List<WordRequest> wordsToChooseFrom = this.getWordsToChoose(roomCode);
        this.getGameFromRoomCode(roomCode).setWordsToPickFrom(wordsToChooseFrom);
        return wordsToChooseFrom;
    }

    public boolean pickWordToPlay(String roomCode, WordRequest chosenWord) {
        // TODO: Validate that user is valid, etc.
        Game game = this.getGameFromRoomCode(roomCode);

        if(game.getWordsToPickFrom().stream().anyMatch(wordRequest -> wordRequest.getWord().equalsIgnoreCase(chosenWord.getWord()))) {
            game.setWordToGuess(chosenWord);
            return game.setGameState("PLAY");
        }
        return false;
    }

    public boolean setGameState(String roomCode, String state) {
        // TODO: Validate that user is valid, etc.

        Game game = this.getGameFromRoomCode(roomCode);
        return game.setGameState(state);
    }

    public boolean endGame(String roomCode) {
        // TODO: Validate that user is valid, etc.

        Game game = this.getGameFromRoomCode(roomCode);
        game.setCurrentState("DELETED");
        this.notifyGameUpdate(roomCode);
        this.deleteGame(roomCode);

        return true;
    }

    public Game createNewGame() {
        Game newGame = new Game();
        newGame.setGameService(this);
        newGame.setMessagingTemplate(messagingTemplate);
        newGame.setRoomCode(generateRandomRoomCode());
        newGame.setSecondsAllowedToGuess(SECONDS_ALLOWED_TO_GUESS);
        return newGame;
    }

    private String generateRandomRoomCode() {
        int leftLimit = 65; // letter 'A'
        int rightLimit = 90; // letter 'Z'
        int targetStringLength = 4;
        Random random = new Random();

        String generatedString = "";

        // TODO: There has to be a better way to do this?
        do {
            generatedString = random.ints(leftLimit, rightLimit + 1)
                    .limit(targetStringLength)
                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                    .toString();
        }
        while (this.getGameFromRoomCode(generatedString) != null);

        return generatedString;
    }
}
