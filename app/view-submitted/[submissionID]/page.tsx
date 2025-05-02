import { GetFormSubmissionById } from "../../../actions/form";
import ViewSubmissionClient from "../../../components/viewSubmissionDialog";

interface SubmissionPageProps {
  params: {
    submissionID: string;
  };
}

export default async function ViewSubmissionPage({ params }: SubmissionPageProps) {
  const { submissionID } = await params;
  const submission = await GetFormSubmissionById(submissionID);

  if (!submission) {
    throw new Error("Submission not found");
  }

  const formContent = JSON.parse(typeof submission.content === "string" ? submission.content : "{}");
  const responses = formContent.responses ?? {};
  const elements = formContent.formContent;

  return <ViewSubmissionClient elements={elements} responses={responses} />;
}
