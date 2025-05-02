import { GetEquipmentTagsForForm, GetFormById, GetFormWithSubmissions, GetFormWithSubmissionDetails  } from "../../../../actions/form";
import FormLinkShare from "../../../../components/FormLinkShare";
import VisitBtn from "../../../../components/VisitBtn";
import { ReactNode } from "react";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { ElementsType, FormElementInstance } from "../../../../components/FormElements";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { format } from "date-fns";
import { formatDistance } from "date-fns/formatDistance";
import { Badge } from "../../../../components/ui/badge";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Button } from "../../../../components/ui/button";
import { MdPreview } from "react-icons/md";

async function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = await params;
  const form = await GetFormById(id);
  //console.log("form", form);
  const shareUrl = form?.form?.shareURL ?? '';
  //console.log("Form URL FORM PAGE", form?.form?.shareURL);
  if (!form) {
    throw new Error("form not found");
  }
  const { visits, submissions } = form;

  let submissionRate = 0;

  if ((visits ?? 0) > 0) {
    submissionRate = ((submissions ?? 0) / (visits ?? 0)) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.form.name}</h1>
        </div>
        <div className="flex justify-between container">
          <h3 className="text-2xl font-bold truncate">{form.clientName}</h3>
          <VisitBtn shareUrl={shareUrl} />
        </div>
        <div className="flex justify-between container">
          <h3 className="text-2xl font-bold truncate">{form.projectName}</h3>
        </div>
      </div>

      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={shareUrl} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={(visits ?? 0).toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />

        <StatsCard
          title="Total submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={(submissions ?? 0).toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />

        <StatsCard
          title="Submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that result in form submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />

        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visits that leaves without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="container pt-10">
        {/*<EquipmentTagsTable id={form.form.id} />
        <SubmissionsTable id={form.form.id} />*/}
        <ProjectLogTable id={form.form.id} />
      </div>
    </>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: string }) {
  // Get form with submissions from the API
  const formWithSubmissions = await GetFormWithSubmissions(id);

  // Check if the form with submissions exists
  if (!formWithSubmissions) {
    throw new Error("Form not found or you don't have access.");
  }

  // Destructure the form and submissions from the returned object
  const { form, submissions } = formWithSubmissions; // Now form and submissions should be available here

  // Parse the form content to extract form elements
  let formElements: FormElementInstance[] = [];

  try {
    const parsed = JSON.parse(form.content ?? "[]");
    if (Array.isArray(parsed)) {
      formElements = parsed;
    }
  } catch (error) {
    console.error("Failed to parse form content:", error);
  }
  // Prepare rows for the table by mapping over the submissions
  const rows: Row[] = [];

  // If there are submissions, parse and push into the rows array
  if (Array.isArray(submissions)) {
    submissions.forEach((submission) => {
      try {
        const content = JSON.parse((submission.content ?? "[]")); // Parse the submission content
        rows.push({
          ...content, // Include all parsed content fields
          submittedAt: submission.createdAt, // Add the submission date
        });
      } catch (error) {
        console.error("Error parsing submission content", error);
      }
    });
  }

  // Define the columns for the table
  const columns = formElements.map((element) => ({
    id: element.id,
    label: element.label,
    type: element.type,
  }));



  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
              <TableHead className="text-muted-foreground text-center uppercase">View</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <RowCell key={column.id} type={column.type} value={row[column.id]} />
                  ))}
                  <TableCell className="text-muted-foreground text-right">
                    {formatDistance(new Date(row.submittedAt), new Date(), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <a href={`/view-submitted/${submissions[index].id}`}>
                      <Button variant={"outline"} className="gap-2">
                        <MdPreview className="h-6 w-6" />
                        View Form
                      </Button>
                    </a>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center text-muted-foreground">
                  No submissions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}

export async function ProjectLogTable({ id }: { id: string }) {
  try {
    const data = await GetFormWithSubmissionDetails(id);

    if (!data) {
      return <div>Error loading project log data.</div>;
    }

    const { submissions } = data;

    return (
      <div>
        <h1 className="text-2xl font-bold my-4">Project Log and Tags</h1>
        <div className="rounded-md border">
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="border p-2 uppercase">Equipment Name</TableHead>
                <TableHead className="border p-2 uppercase">Equipment Tag</TableHead>
                <TableHead className="border p-2 uppercase text-right">Submitted At</TableHead>
                <TableHead className="border p-2 uppercase text-center">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length > 0 ? (
                submissions.map((s, i) => {
                  if ("tag" in s) {
                    return (
                      <TableRow key={i}>
                        <TableCell className="border p-2">{s.equipmentName}</TableCell>
                        <TableCell className="border p-2">{s.tag}</TableCell>
                        <TableCell className="border p-2 text-right">
                          {s.submittedAt
                            ? formatDistance(new Date(s.submittedAt), new Date(), { addSuffix: true })
                            : ""}
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                        <a href={`/view-submitted/${submissions[i].submissionId}`}>
                            <Button variant="outline" className="gap-2">
                              <MdPreview className="h-6 w-6" />
                              View Form
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow key={i}>
                        <TableCell colSpan={4} className="text-center text-sm text-muted-foreground italic">
                          {s.error}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No submissions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ProjectLogTable:", error);
    return <div>Error loading data</div>;
  }
}

