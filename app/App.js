import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

const QUIZ_BANK = [
  {
    id: "math-1",
    subject: "Math",
    question: "What is 12 × 8?",
    options: ["96", "84", "108", "88"],
    answer: "96",
  },
  {
    id: "science-1",
    subject: "Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    id: "history-1",
    subject: "History",
    question: "Who wrote the national anthem of India?",
    options: [
      "Rabindranath Tagore",
      "Sarojini Naidu",
      "Bankim Chandra Chattopadhyay",
      "Subramania Bharati",
    ],
    answer: "Rabindranath Tagore",
  },
];

const AUTO_QUIZZES = [
  {
    id: "auto-1",
    title: "Morning Booster",
    description: "5 quick questions to start the day.",
    subject: "Math + Science",
    time: "5 mins",
  },
  {
    id: "auto-2",
    title: "After School Challenge",
    description: "Mixed quiz for grades 6-8.",
    subject: "English + GK",
    time: "8 mins",
  },
  {
    id: "auto-3",
    title: "Weekend Revision",
    description: "Extra practice for weekly tests.",
    subject: "Social Studies",
    time: "10 mins",
  },
];

const FRIENDS = [
  { id: "friend-1", name: "Aarav", grade: "7", streak: 5 },
  { id: "friend-2", name: "Diya", grade: "6", streak: 7 },
  { id: "friend-3", name: "Kabir", grade: "8", streak: 3 },
];

const SCREEN = {
  AUTH: "AUTH",
  PROFILE: "PROFILE",
  HOME: "HOME",
  QUIZ: "QUIZ",
  RESULTS: "RESULTS",
  CHALLENGE: "CHALLENGE",
};

const GRADES = ["4", "5", "6", "7", "8", "9", "10"];

export default function App() {
  const [screen, setScreen] = useState(SCREEN.AUTH);
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [grade, setGrade] = useState("");
  const [dailyChallengeEnabled, setDailyChallengeEnabled] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [challengeMessage, setChallengeMessage] = useState("");

  const score = useMemo(() => {
    return QUIZ_BANK.reduce((total, question) => {
      return total + (selectedAnswers[question.id] === question.answer ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const resetQuiz = () => {
    setSelectedAnswers({});
    setChallengeMessage("");
    setScreen(SCREEN.HOME);
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < QUIZ_BANK.length) {
      setChallengeMessage("Please answer every question before submitting.");
      return;
    }
    setChallengeMessage("");
    setScreen(SCREEN.RESULTS);
  };

  const handleSelectAnswer = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleAuthContinue = () => {
    if (!email || !password) {
      setChallengeMessage("Please enter your email and password.");
      return;
    }
    if (isSignup && password !== confirmPassword) {
      setChallengeMessage("Passwords do not match.");
      return;
    }
    setChallengeMessage("");
    setScreen(SCREEN.PROFILE);
  };

  const handleProfileSave = () => {
    if (!nickname || !grade) {
      setChallengeMessage("Please choose your nickname and grade.");
      return;
    }
    setChallengeMessage("");
    setScreen(SCREEN.HOME);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rashu Quiz</Text>
        <Text style={styles.headerSubtitle}>
          Practice, play, and challenge friends
        </Text>
      </View>

      {screen === SCREEN.AUTH && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>{isSignup ? "Create account" : "Welcome back"}</Text>
          <Text style={styles.sectionBody}>
            Students can login or signup to save progress and join daily challenges.
          </Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="student@email.com"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {isSignup ? (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="••••••••"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          ) : null}
          {challengeMessage ? (
            <Text style={styles.warningText}>{challengeMessage}</Text>
          ) : null}
          <Pressable style={styles.primaryButton} onPress={handleAuthContinue}>
            <Text style={styles.primaryButtonText}>
              {isSignup ? "Continue" : "Login"}
            </Text>
          </Pressable>
          <Pressable style={styles.linkButton} onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.linkText}>
              {isSignup ? "Already have an account? Login" : "New here? Create an account"}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {screen === SCREEN.PROFILE && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>Student Profile</Text>
          <Text style={styles.sectionBody}>
            Choose your grade and daily challenge preferences.
          </Text>
          <Text style={styles.label}>Nickname</Text>
          <TextInput
            placeholder="e.g. Sam"
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
          />
          <Text style={styles.label}>Select Grade</Text>
          <View style={styles.gradeRow}>
            {GRADES.map((item) => (
              <Pressable
                key={item}
                style={[styles.gradeChip, grade === item && styles.gradeChipSelected]}
                onPress={() => setGrade(item)}
              >
                <Text
                  style={[styles.gradeChipText, grade === item && styles.gradeChipTextSelected]}
                >
                  Grade {item}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Daily Challenges</Text>
              <Text style={styles.toggleSubtitle}>
                Receive auto quizzes every morning.
              </Text>
            </View>
            <Switch
              value={dailyChallengeEnabled}
              onValueChange={setDailyChallengeEnabled}
              thumbColor={dailyChallengeEnabled ? "#0b5fff" : "#cbd5e0"}
            />
          </View>
          {challengeMessage ? (
            <Text style={styles.warningText}>{challengeMessage}</Text>
          ) : null}
          <Pressable style={styles.primaryButton} onPress={handleProfileSave}>
            <Text style={styles.primaryButtonText}>Save & Continue</Text>
          </Pressable>
          <Pressable style={styles.linkButton} onPress={() => setScreen(SCREEN.AUTH)}>
            <Text style={styles.linkText}>Back to Login</Text>
          </Pressable>
        </ScrollView>
      )}

      {screen === SCREEN.HOME && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>Welcome{nickname ? `, ${nickname}` : ""} 👋</Text>
          <Text style={styles.sectionBody}>
            Grade {grade || "--"} • {dailyChallengeEnabled ? "Daily challenges on" : "Daily challenges off"}
          </Text>
          <View style={styles.actionsRow}>
            <Pressable style={styles.primaryButton} onPress={() => setScreen(SCREEN.QUIZ)}>
              <Text style={styles.primaryButtonText}>Start Quiz</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setScreen(SCREEN.CHALLENGE)}
            >
              <Text style={styles.secondaryButtonText}>Challenge Friends</Text>
            </Pressable>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Daily Streaks</Text>
            <Text style={styles.featureBody}>
              Keep up your practice streak and unlock rewards.
            </Text>
          </View>
          <View style={styles.autoQuizHeader}>
            <Text style={styles.sectionTitle}>Auto Quizzes</Text>
            <Text style={styles.sectionBody}>
              Ready-made quizzes that refresh every day.
            </Text>
          </View>
          {AUTO_QUIZZES.map((quiz) => (
            <View key={quiz.id} style={styles.autoQuizCard}>
              <View>
                <Text style={styles.autoQuizTitle}>{quiz.title}</Text>
                <Text style={styles.autoQuizMeta}>{quiz.subject} • {quiz.time}</Text>
                <Text style={styles.autoQuizBody}>{quiz.description}</Text>
              </View>
              <Pressable style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Start</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {screen === SCREEN.QUIZ && (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Quick Quiz</Text>
          <Text style={styles.sectionBody}>Answer all questions to finish.</Text>
          <FlatList
            data={QUIZ_BANK}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.quizList}
            renderItem={({ item }) => (
              <View style={styles.quizCard}>
                <Text style={styles.quizSubject}>{item.subject}</Text>
                <Text style={styles.quizQuestion}>{item.question}</Text>
                {item.options.map((option) => {
                  const isSelected = selectedAnswers[item.id] === option;
                  return (
                    <Pressable
                      key={option}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleSelectAnswer(item.id, option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
          {challengeMessage ? (
            <Text style={styles.warningText}>{challengeMessage}</Text>
          ) : null}
          <Pressable style={styles.primaryButton} onPress={handleSubmitQuiz}>
            <Text style={styles.primaryButtonText}>Submit Quiz</Text>
          </Pressable>
          <Pressable style={styles.linkButton} onPress={() => setScreen(SCREEN.HOME)}>
            <Text style={styles.linkText}>Back to Home</Text>
          </Pressable>
        </View>
      )}

      {screen === SCREEN.RESULTS && (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Great job{nickname ? `, ${nickname}` : ""}!</Text>
          <Text style={styles.sectionBody}>
            You scored {score} out of {QUIZ_BANK.length}.
          </Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Suggested Next Steps</Text>
            <Text style={styles.scoreBody}>• Review incorrect answers</Text>
            <Text style={styles.scoreBody}>• Challenge a friend</Text>
            <Text style={styles.scoreBody}>• Unlock tomorrow's quiz pack</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setScreen(SCREEN.CHALLENGE)}>
            <Text style={styles.primaryButtonText}>Challenge Friends</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={resetQuiz}>
            <Text style={styles.secondaryButtonText}>Reset Quiz</Text>
          </Pressable>
        </View>
      )}

      {screen === SCREEN.CHALLENGE && (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Challenge Friends</Text>
          <Text style={styles.sectionBody}>
            Pick a friend and send them a quiz challenge.
          </Text>
          <FlatList
            data={FRIENDS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.friendRow}>
                <View>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendMeta}>
                    Grade {item.grade} • {item.streak}-day streak
                  </Text>
                </View>
                <Pressable style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Send</Text>
                </Pressable>
              </View>
            )}
          />
          <Pressable style={styles.secondaryButton} onPress={() => setScreen(SCREEN.HOME)}>
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafc",
  },
  header: {
    padding: 24,
    backgroundColor: "#0b5fff",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#dbe6ff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1f2b",
  },
  sectionBody: {
    marginTop: 8,
    fontSize: 15,
    color: "#4a5568",
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    color: "#2d3748",
    fontWeight: "600",
  },
  input: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d0d7e2",
    backgroundColor: "#ffffff",
  },
  actionsRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#0b5fff",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0b5fff",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#0b5fff",
    fontWeight: "700",
  },
  linkButton: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: "#0b5fff",
    fontWeight: "600",
  },
  featureCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  featureTitle: {
    fontWeight: "700",
    color: "#1a202c",
  },
  featureBody: {
    marginTop: 6,
    color: "#4a5568",
  },
  quizList: {
    marginTop: 16,
    paddingBottom: 16,
  },
  quizCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  quizSubject: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#718096",
  },
  quizQuestion: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#1a202c",
  },
  optionButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  optionButtonSelected: {
    backgroundColor: "#ebf1ff",
    borderColor: "#0b5fff",
  },
  optionText: {
    color: "#2d3748",
  },
  optionTextSelected: {
    color: "#0b5fff",
    fontWeight: "700",
  },
  warningText: {
    marginTop: 8,
    color: "#b83280",
    fontWeight: "600",
  },
  scoreCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff7ed",
  },
  scoreTitle: {
    fontWeight: "700",
    color: "#9a3412",
  },
  scoreBody: {
    marginTop: 4,
    color: "#9a3412",
  },
  friendRow: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendName: {
    fontWeight: "700",
    color: "#1a202c",
  },
  friendMeta: {
    marginTop: 4,
    color: "#718096",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#0b5fff",
    borderRadius: 999,
  },
  smallButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  gradeRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gradeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    backgroundColor: "#ffffff",
  },
  gradeChipSelected: {
    borderColor: "#0b5fff",
    backgroundColor: "#ebf1ff",
  },
  gradeChipText: {
    color: "#2d3748",
    fontWeight: "600",
  },
  gradeChipTextSelected: {
    color: "#0b5fff",
  },
  toggleRow: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleTitle: {
    fontWeight: "700",
    color: "#1a202c",
  },
  toggleSubtitle: {
    marginTop: 4,
    color: "#718096",
  },
  autoQuizHeader: {
    marginTop: 24,
  },
  autoQuizCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  autoQuizTitle: {
    fontWeight: "700",
    color: "#1a202c",
  },
  autoQuizMeta: {
    marginTop: 4,
    color: "#718096",
  },
  autoQuizBody: {
    marginTop: 6,
    color: "#4a5568",
  },
});
