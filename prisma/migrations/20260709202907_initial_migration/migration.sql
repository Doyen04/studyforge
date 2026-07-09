-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySet" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "McqQuestion" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "McqQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillInBlank" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "acceptableAnswers" TEXT NOT NULL,

    CONSTRAINT "FillInBlank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheoryQuestion" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "referenceAnswer" TEXT NOT NULL,
    "keyPoints" TEXT NOT NULL,

    CONSTRAINT "TheoryQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questionRefs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "answers" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McqQuestion" ADD CONSTRAINT "McqQuestion_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillInBlank" ADD CONSTRAINT "FillInBlank_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryQuestion" ADD CONSTRAINT "TheoryQuestion_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
