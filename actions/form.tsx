"use server";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth"; // Ensure getCurrentUser is imported correctly
///import { vi } from "date-fns/locale";
//import { sub } from "date-fns";
//import { string } from 'zod';
//import { formSchemaType } from "../schemas/form";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// UserNotFoundErr class for custom error handling
class UserNotFoundErr extends Error {}

/*export async function InsertClient(NameClient: string) {
  try {
    const { errors, data } = await client.models.Client.create({
      ClientName: NameClient,
    });

    if (errors) {
      console.error("Error:", errors);
      throw new Error("Failed to insert client.");
    }
    return data; // Returns the inserted client data
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}*/
/*InsertClient("Fortescue")
  .then((data) => console.log("Client:", data))
  .catch((error) => console.error("Error fetching client with projects:", error));*/

// Function to insert a single project (you may already have something like this)
/*export async function InsertProject(name: string, projNum: string, clientID: string) {
  try {
    const { errors, data } = await client.models.Projectt.create({
      projectID: projNum,
      projectName: name,
      ClientID: clientID
    });

    if (errors) {
      console.error("Error:", errors);
      throw new Error("Failed to insert client.");
    }
    return data; // Returns the inserted client data
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}*/

// Function to insert multiple projects
/*export async function InsertMultipleProjects(names: string[], projNum: string[], clientIDs: string[]) {
  const insertedProjects: any[] = []; // Array to store successfully inserted projects
  const failedProjects: string[] = []; // Array to store project names that failed to insert

  // Ensure that input arrays have the same length
  if (names.length !== projNum.length || projNum.length !== clientIDs.length) {
    throw new Error("Input arrays must have the same length.");
  }

  // Loop through the arrays and insert projects one by one
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const projectNumber = projNum[i];
    const clientID = clientIDs[i];

    try {
      const projectData = await InsertProject(name, projectNumber, clientID); // Call to insert a single project
      insertedProjects.push(projectData); // Store the successful insert result
    } catch (error) {
      console.error(`Failed to insert project: ${name}`, error);
      failedProjects.push(name); // Store the failed project name
    }
  }

  // Return the results: successful insertions and failed ones
  return {
    insertedProjects,
    failedProjects,
  };
}*/

/*export async function InsertMultipleClients(names: string[]) {
  const insertedClients: any[] = []; // Array to store successfully inserted clients
  const failedClients: string[] = []; // Array to store client names that failed to insert

  for (let name of names) {
    try {
      const clientData = await InsertClient(name); // Call the single client insert function
      insertedClients.push(clientData); // Store the successful insert result
    } catch (error) {
      console.error(`Failed to insert client: ${name}`, error);
      failedClients.push(name); // Store the failed client name
    }
  }

  // Return the results
  return {
    insertedClients,
    failedClients,
  };
}*/

/*const clients = await GetClients();*/

/*const cID = clients.clientIDs;
console.log(cID);
const projects = ["project1", "project2","project3","project4"];
const  projNumbers = ["projNumber1","projNumber2","projNumber3","projNumber4"];*/

/*InsertProject(projects[0],projNumbers[0],cID[0]);
InsertProject(projects[1],projNumbers[1],cID[1]);
InsertProject(projects[2],projNumbers[2],cID[2]);
InsertProject(projects[3],projNumbers[3],cID[3]);*/

/*const clientNames = ["Client4"]; // Example client names

InsertMultipleClients(clientNames)
  .then((result) => {
    console.log("Successfully inserted clients:", result.insertedClients);
    console.log("Failed to insert clients:", result.failedClients);
  })
  .catch((error) => {
    console.error("Error inserting clients:", error);
  });*/

export async function GetClients() {
  try {
    const { errors, data } = await client.models.Client.list();

    if (errors) {
      console.error("Error:", errors);
      throw new Error("Failed to fetch clients.");
    }

    // Extract client names and client IDs
    const clientNames = data.map((client) => client.ClientName);
    const clientIDs = data.map((client) => client.id);

    // Return both client names and IDs in an object or an array
    return {
      clientNames,
      clientIDs,
    };

    // Alternatively, if you want to return an array:
    // return [clientNames, clientIDs];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/*async function fetchData() {
  const clients = await GetClients();
  const cID = clients.clientIDs;
  console.log(cID);
  const projects = ["project1", "project2", "project3", "project4"];
  const projNumbers = ["projNumber1", "projNumber2", "projNumber3", "projNumber4"];
 
  await InsertProject(projects[0], projNumbers[0], cID[0]);
  await InsertProject(projects[1], projNumbers[1], cID[1]);
  await InsertProject(projects[2], projNumbers[2], cID[2]);
  await InsertProject(projects[3], projNumbers[3], cID[3]);
}*/

//fetchData().catch(console.error);

export async function GetProjects() {
  try {
    const { errors, data } = await client.models.Projectt.list();

    if (errors) {
      console.error("Error:", errors);
      throw new Error("Failed to fetch projects.");
    }

    // Separate projectIDs and projectNames
    const projectIDs = data.map((project) => project.projectID); // List of all projectIDs
    const projectNames = data.map((project) => project.projectName); // List of all projectNames

    // Return both separately
    return { projectIDs, projectNames };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function GetFormStats() {
  try {
    // Fetch all forms
    const { data: forms, errors } = await client.models.Form.list();

    if (errors) {
      console.error(errors);
      return { visits: 0, submissions: 0, submissionRate: 0, bounceRate: 0 };
    }

    // Calcular stats com TODOS os forms (sem filtrar userId)
    const visits = forms.reduce((sum, form) => sum + (form.visits || 0), 0);
    const submissions = forms.reduce(
      (sum, form) => sum + (form.submissions || 0),
      0,
    );

    let submissionRate = 0;
    if (visits > 0) {
      submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
      visits,
      submissions,
      submissionRate,
      bounceRate,
    };
  } catch (error) {
    console.error("Error fetching form stats:", error);
    return { visits: 0, submissions: 0, submissionRate: 0, bounceRate: 0 };
  }
}



export async function GetForms() {
  try {
    
    const { data: forms, errors } = await client.models.Form.list();

    if (errors) {
      console.error(errors);
      return [];
    }
    //console.log("Forms:", forms);
    return forms;
    
  } catch (error) {
    console.error("Error fetching forms:", error);
    return [];
  }
}


export async function GetFormById(id: string) {
  try {
    const { data: form, errors } = await client.models.Form.get({ id });

    if (errors) {
      console.error(errors);
      return null;
    }

    if (!form) {
      throw new Error("Form not found.");
    }

    let projectName = null;
    let clientName = null;
    let shareURL = null;

    if (form.projID) {
      const { data: projectData, errors: projectErrors } = await client.models.Projectt.list({
        filter: { projectID: { eq: form.projID } },
      });

      if (projectErrors) {
        console.error(projectErrors);
      }

      const project = projectData?.[0];
      if (project) {
        projectName = project.projectName;

        if (project.ClientID) {
          const { data: clientData, errors: clientErrors } = await client.models.Client.get({
            id: project.ClientID,
          });

          if (clientErrors) {
            console.error(clientErrors);
          }

          if (clientData) {
            clientName = clientData.ClientName;
          }
        }
      }
    }

    // Retornar também visitas e submissões
    return {
      form,
      projectName,
      clientName,
      shareURL: form.shareURL,
      visits: form.visits ?? 0,
      submissions: form.submissions ?? 0,
    };
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return null;
  }
}


export async function UpdateFormContent(id: string, content: any) {
  try {
    const form = {
      id,
      content,
    };

    const { data: updatedForm, errors } = await client.models.Form.update(form);

    if (errors) {
      console.error(errors);
      throw new Error("Failed to update form content.");
    }

    return updatedForm;
  } catch (error) {
    console.error("Error updating form content:", error);
    throw new Error("Failed to update form content.");
  }
}

// Define your server-side action
export async function saveFormAction(formData: FormData) {
  const id = formData.get("id") as string;
  const content = formData.get("content") as string;

  // Call your existing server-side function (UpdateFormContent)
  await UpdateFormContent(id, content);
}
/*const data = [
  ['Section 1', 'A', 'B', 'C', 'D', 'E', 'F'],
  ['E', 'F', 'G', 'H', 'I'],
  ['J', 'K', 'L', 'M', 'N'],
];

// Convert the data to a JSON string
const content = JSON.stringify(data);


UpdateFormContent("b5a11d77-fef7-4330-8479-db5d7aea3aff", content)
  .then(updatedForm => {
    console.log('Form updated:', updatedForm);
  })
  .catch(error => {
    console.error('Error updating form:', error);
  });
*/

export async function PublishForm(id: string, content: string, shareURL: string) {
  try {

    const form = {
      id: id,
      content: content,
      shareURL: shareURL,
      published: true,
    };

    const { data: updatedForm, errors } = await client.models.Form.update(form);

    if (errors) {
      console.error(errors);
      throw new Error("Failed to publish the form.");
    }

    return updatedForm;
  } catch (error) {
    console.error("Error publishing form:", error);
    throw new Error("Failed to publish the form.");
  }
}

export async function publishFormAction(formData: FormData) {
  const id = formData.get("id") as string;
  const content = formData.get("content") as string;
  const shareURL = formData.get("shareURL") as string;

  await PublishForm(id, content, shareURL);
}

export async function GetFormContentByUrl(formUrl: string) {
  try {
    
    //const formURL = `/submit/${formUrl}`;
    const formURL = formUrl.startsWith('/submit/') ? formUrl : `/submit/${formUrl}`;
    const { data: forms, errors } = await client.models.Form.list({
      filter: { shareURL: { eq: formURL } },
    });

    if (errors || !forms || forms.length === 0) {
      console.error(errors || "Form not found, please try again.");
      throw new Error("Form not found.");
    }

    const form = forms[0];
    const updatedVisits = form.visits ? form.visits + 1 : 1;

    const updatedForm = {
      id: form.id,
      visits: updatedVisits,
    };

    const { errors: updateErrors } =
      await client.models.Form.update(updatedForm);

    if (updateErrors) {
      console.error(updateErrors);
      throw new Error("Failed to update form visits.");
    }
    //console.log("form:", form);
    return form;
  } catch (error) {
    console.error("Error fetching form content by URL:", error);
    throw new Error("Error fetching form content by URL.");
  }
}

export async function SubmitForm(formId: string, tagId: string, content: string) {
  const submission = {
    formId,
    content,
    createdAt: new Date().toISOString(),
  };
  
  const { data: submissionData } = await client.models.FormSubmissions.create(submission);

  if (!submissionData?.id) throw new Error("Error to create the submssion");

  const submissionId = submissionData.id;

  const { data: formList } = await client.models.Form.list({
    filter: { id: { eq: formId } },
  });

  const form = formList[0];
  await client.models.Form.update({
    id: form.id,
    submissions: (form.submissions || 0) + 1,
  });

  const { data: formTags } = await client.models.FormTag2.list({
    filter: { tagID: { eq: tagId } },
  });

  if (!formTags.length) throw new Error("FormTag2 not found");

  await client.models.FormTag2.update({
    id: formTags[0].id,
    contentTest: submissionId,
  });

  return submissionData;
}


export async function submitFormAction(formData: FormData) {
  const formId = formData.get("formId") as string;
  const tagId = formData.get("tagId") as string;
  const rawResponses = formData.get("responses") as string;
  const rawFormContent = formData.get("formContent") as string;

  const submission = {
    responses: JSON.parse(rawResponses),
    formContent: JSON.parse(rawFormContent),
    submittedAt: new Date().toISOString(),
  };

  const jsonContent = JSON.stringify(submission);
  await SubmitForm(formId, tagId, jsonContent);
}



export async function GetFormWithSubmissions(id: string) {
  try {
    const { data: form, errors } = await client.models.Form.get({ id });

    if (errors) {
      console.error(errors);
      return null;
    }

    if (form) {
      const { data: submissions, errors: submissionErrors } =
        await client.models.FormSubmissions.list({
          filter: { formId: { eq: form.id } },
        });

      if (submissionErrors) {
        console.error(submissionErrors);
      }

      return { form, submissions };
    }

    throw new Error("Form not found.");
  } catch (error) {
    console.error("Error fetching form with submissions:", error);
    throw new Error("Failed to fetch form with submissions.");
  }
}

export async function GetSubmissionWithTagInfo(submissionId: string) {

  const submissionResponse = await client.models.FormSubmissions.get({ id: submissionId });


  const submission = submissionResponse.data;
  if (!submission) {
    throw new Error("FormSubmission not found.");
  }

  const formId = submission.formId;
  if (!formId) {
    throw new Error("formId not found in submissions.");
  }

  const formTagsResponse = await client.models.FormTag2.list({
    filter: {
      contentTest: { contains: submissionId },
    }
  });


  if (!formTagsResponse.data.length) {
    throw new Error("FormTag2 not found with the associated contentTest.");
  }

  const formTag = formTagsResponse.data[0];

  const equipmentTagResponse = await client.models.EquipmentTag2.get({
    id: formTag.tagID ?? "", 
  });

  if (!equipmentTagResponse.data) {
    throw new Error("EquipmentTag2 not found.");
  }

  return {
    formId: formId,
    submissionId: submission.id,
    submittedAt: submission.createdAt,
    equipmentName: equipmentTagResponse.data.EquipmentName ?? "No name",
    tag: equipmentTagResponse.data.Tag ?? "No tag",
  };
}

export async function GetFormWithSubmissionDetails(id: string) {
  try {
    // Fetch the form with submissions
    const { data: form, errors: formErrors } = await client.models.Form.get({ id });

    if (formErrors) {
      console.error(formErrors);
      return null;
    }

    if (!form) {
      throw new Error("Form not found.");
    }

    // Fetch the submissions related to the form
    const { data: submissions, errors: submissionErrors } = await client.models.FormSubmissions.list({
      filter: { formId: { eq: form.id } },
    });

    if (submissionErrors) {
      console.error(submissionErrors);
      return null;
    }

    // Fetch additional tag and equipment details for each submission
    const submissionDetails = await Promise.all(
      submissions.map(async (submission) => {
        const formId = submission.formId;
        const submissionId = submission.id;

        // Fetch the associated tag and equipment info
        const formTagsResponse = await client.models.FormTag2.list({
          filter: {
            contentTest: { contains: submissionId }, // Find related tags by submission ID
          },
        });

        if (!formTagsResponse.data.length) {
          return { ...submission, error: "No form tag found for this submission." };
        }

        const formTag = formTagsResponse.data[0];
        const equipmentTagResponse = await client.models.EquipmentTag2.get({
          id: formTag.tagID ?? "", // Use the tagID from FormTag2
        });

        if (!equipmentTagResponse.data) {
          return { ...submission, error: "No equipment tag found for this submission." };
        }

        return {
          formId,
          submissionId,
          submittedAt: submission.createdAt,
          equipmentName: equipmentTagResponse.data.EquipmentName ?? "No Equipment Name",
          tag: equipmentTagResponse.data.Tag ?? "No Equipment Tag",
        };
      })
    );

    return {
      form,
      submissions: submissionDetails,
    };
  } catch (error) {
    console.error("Error fetching form with submission details:", error);
    throw new Error("Failed to fetch form and submission details.");
  }
}

export async function GetFormSubmissionById(submissionId: string) {

  try {
    const { data: content, errors } = await client.models.FormSubmissions.get({ id: submissionId });
    if (errors) {
      console.error("Error fetching form:", errors);
      return null;
    }
    if (!content) {
      throw new Error("Content not found.");
    }
    return  content ;
  } catch (error) {
    console.error("Error in GetFormSubmissionById:", error);
    return null;
  }

}
export async function GetEquipmentTagsForForm(id: string) {
  try {
    // Fetch the form data
    const { data: form, errors } = await client.models.Form.get({ id });

    if (errors) {
      console.error("Error fetching form:", errors);
      return null;
    }

    if (!form) {
      throw new Error("Form not found.");
    }

    // Fetch equipment tags related to the form
    const { data: equipmentTags, errors: equipmentTagsErrors } =
      await client.models.FormTag2.list({
        filter: { formID: { eq: form.id } },
      });

    if (equipmentTagsErrors) {
      console.error("Error fetching equipment tags:", equipmentTagsErrors);
      return null;
    }

    if (!equipmentTags || equipmentTags.length === 0) {
      console.log("No equipment tags found.");
      return { form, equipmentTags: [] };
    }

      // Fetch related equipment details for each tag
    const equipmentDetails = await Promise.all(
      equipmentTags.map(async (tag) => {
        // Ensure that tag.tagID is valid before making the API call
        const equipmentTag = tag.tagID ? await client.models.EquipmentTag2.get({ id: tag.tagID }) : null;

        if (equipmentTag) {
          return equipmentTag;
        } else {
          console.error("Invalid tagID:", tag.tagID);
          return null;
        }
      })
    );
    
    return { form, equipmentTags: equipmentDetails.filter(tag => tag !== null) };

  } catch (error) {
    console.error("Error fetching equipment tags for form:", error);
    return null;
  }
}


export async function GetClientWithProjects(ClientID: string) {
  try {
    const { errors, data } = await client.models.Client.get({ id: ClientID });

    if (errors || !client) {
      console.error("Error fetching client:", errors);
      throw new Error("Client not found.");
    }

    // Fetch all projects related to this client
    const { data: projects, errors: projectErrors } =
      await client.models.Projectt.list({
        filter: { ClientID: { eq: ClientID } },
      });

    if (projectErrors) {
      console.error("Error fetching projects:", projectErrors);
    }

    return { ...data, projects };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/*GetClientWithProjects("1ad74bce-bd9d-4131-83ef-effecba74c7d")
  .then((data) => console.log("Client with Projects:", data))
  .catch((error) => console.error("Error fetching client with projects:", error));*/

export async function GetFormsWithClient(ClientID: string) {
  const { userId } = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }

  try {
    // Fetch projects linked to the ClientID
    const { data: projects, errors: projectErrors } =
      await client.models.Projectt.list({
        filter: { ClientID: { eq: ClientID } },
      });
    console.log("Projects Found:", projects);
    if (projectErrors || !projects || projects.length === 0) {
      console.error(projectErrors || "No projects found for this client.");
      throw new Error("No projects found for this client.");
    }

    // Fetch forms for each project
    const forms = await Promise.all(
      projects.map(async (project) => {
        const { data: projectForms } = await client.models.Form.list({
          filter: { projID: { eq: project.projectID } },
        });
        console.log("Project ID:", project.projectID);
        console.log(`Forms for Project ${project.projectName}:`, projectForms);

        return projectForms.map((form) => ({
          ...form,
          projectName: project.projectName,
        }));
      }),
    );

    return forms.flat();
  } catch (error) {
    console.error("Error fetching forms with client:", error);
    throw new Error("Failed to fetch forms for the client.");
  }
}

/*GetFormsWithClient("1ad74bce-bd9d-4131-83ef-effecba74c7d")
.then((forms) => console.log("Forms:", forms))
.catch((error) => console.error("Error:", error));*/

export async function GetFormsInformation() {
  try {
    const { errors: clientErrors, data: clientsData } =
      await client.models.Client.list();

    if (clientErrors) {
      console.error("Error:", clientErrors);
      throw new Error("Failed to fetch forms.");
    }

    let results = [];

    for (const clientItem of clientsData) {
      const { errors: projectErrors, data: projectsData } =
        await client.models.Projectt.list({
          filter: { ClientID: { eq: clientItem.id } },
        });

      if (projectErrors) {
        console.error("Error:", projectErrors);
        throw new Error("Error fetching projects");
      }

      for (const projectItem of projectsData) {
        //console.log(`Fetching forms for project: ${projectItem.projectName}, ID: ${projectItem.projectID}`);

        const { errors: formErrors, data: formsData } =
          await client.models.Form.list({
            filter: { projID: { eq: projectItem.projectID } }, // Ensure the correct key is used
          });

        if (formErrors) {
          console.error("Error:", formErrors);
          throw new Error("Error fetching forms");
        }

        results.push({
          clientName: clientItem.ClientName,
          projectName: projectItem.projectName,
          projectID: projectItem.projectID,
          forms: formsData.map((form) => ({
            id: form.id,
            name: form.name,
            description: form.description,
            published: form.published,
            content: form.content,
            createdAt: form.createdAt,
            visits: form.visits,
            submissions: form.submissions,
          })),
        });
      }
    }
    //console.log("Results:", results);
    return results;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

/*const formsInfo = await GetFormsInformation()
console.log('Form Info:', formsInfo);*/

export async function GetProjectsFromClientName(ClientName: string) {
  try {
    // Fetch Client based on ClientName
    const { errors, data: clientData } = await client.models.Client.list({
      filter: { ClientName: { eq: ClientName } },
    });

    if (errors || clientData.length === 0) {
      console.error("Error fetching client or client not found:", errors);
      throw new Error("Client not found.");
    }

    // Assuming each client has an array of projects
    const Clients = clientData[0]; // Assuming the first client in the list is the one we're interested in
    const { data: projects, errors: projectErrors } =
      await client.models.Projectt.list({
        filter: { ClientID: { eq: Clients.id } },
      });

    if (projectErrors) {
      console.error("Error fetching projects:", projectErrors);
    }
    const projectNames = projects.map((project) => project.projectName);
    // Return client and associated projects
    return { projectNames };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function CreateForm(
  name: string,
  description: string,
  projectName: string,
) {
  // Fetch the project details using projectName
  const { errors: projectErrors, data: projectsData } =
    await client.models.Projectt.list({
      filter: { projectName: { eq: projectName } },
    });

  if (projectErrors) {
    console.error("Error fetching projects:", projectErrors);
    throw new Error("Failed to fetch projects.");
  }

  if (projectsData.length === 0) {
    throw new Error(`Project with name "${projectName}" not found.`);
  }

  // Get the first matching project's ID
  const projID = projectsData[0].projectID;

  // Now create the form using projID
  const { errors: formerrors, data: form } = await client.models.Form.create({
    projID: projID,
    name: name,
    description: description,
  });

  if (formerrors) {
    console.error("Error creating form:", formerrors);
    throw new Error("Something went wrong while creating the form");
  }

  return {
    formId: form?.id,
    projID: projID,
  };
}


export const runForm = async (
  formUrl:string,
  EquipName: string,
  EquipTag: string,
): Promise<{
  success: boolean;
  createdTagID?: string;
  tagCreatedAt?: string;
}> => {
  //console.log("runForm called with:", formUrl, EquipName, EquipTag);
  try {
    const formResp = await GetFormContentByUrl(formUrl);
    
    if (!formResp) {
      console.error("Form not found with the provided TestName and ProjectID");
      return { success: false };
    }

    const form = formResp;

    const existingTagResp = await client.models.EquipmentTag2.list({
      filter: {
        Tag: { eq: EquipTag },
        EquipmentName: { eq: EquipName },
      },
    });

    const existingTag = existingTagResp.data?.[0];

    if (existingTag) {
      const linkedFormResp = await client.models.FormTag2.list({
        filter: {
          tagID: { eq: existingTag.id },
          formID: { eq: form.id },
        },
      });

      if (linkedFormResp.data?.length > 0) {
        console.error(
          "This equipment and tag are already associated with this form and project.",
        );
        alert(
          "Error: This equipment and tag are already associated with this form and project.",
        );
        return { success: false };
      }
    }

    let createResp = null;
    let createdTagID: string | undefined = undefined;
    let tagCreatedAt: string | undefined = undefined;

    if (!existingTag) {
      createResp = await client.models.EquipmentTag2.create({
        Tag: EquipTag,
        EquipmentName: EquipName,
      });

      if (!createResp.data) {
        console.error("Failed to create EquipmentTag");
        return { success: false };
      }

      createdTagID = createResp.data.id;
      tagCreatedAt = new Date(createResp.data.createdAt)
        .toISOString()
        .split("T")[0];
    }

    const formTagResp = await client.models.FormTag2.create({
      formID: form.id,
      tagID: existingTag ? existingTag.id : createdTagID,
    });

    if (!formTagResp.data) {
      console.error("Failed to create FormTag");
      return { success: false };
    }

    return { success: true, createdTagID, tagCreatedAt };
  } catch (error) {
    console.error("Error executing runForm:", error);
    return { success: false };
  }
};

// Fetch formId by TestName and ProjectID
const fetchFormByNameAndProject = async (
  TestName: string,
  ProjectID: string,
) => {
  try {
    //console.log("Fetching form with TestName:", TestName, "and ProjectID:", ProjectID);
    const formResp = await client.models.Form.list({
      filter: {
        name: { eq: TestName },
        projID: { eq: ProjectID },
      },
    });

    //console.log("Form fetch response:", formResp);

    // If form exists, return the first result
    return formResp.data?.[0];
  } catch (error) {
    console.error("Error fetching form:", error);
    return null;
  }
};

/*await runForm("Test name 1", "HE101P001", "Compressor X", "TAG-001")
.then((newEquipmentTag) => console.log("Created FormTag:", newEquipmentTag))
.catch((error) => console.error("Error:", error)); // Handle any errors */

export async function GetFormsByClientName(ClientName: string) {
  // 1. Fetch the Client ID
  const clientResult = await client.models.Client.list({
    filter: { ClientName: { eq: ClientName } },
  });

  const clientData = clientResult.data?.[0];
  if (!clientData) return [];

  const clientID = clientData.id;

  // 2. Fetch all Projects with the corresponding ClientID
  const projectsResult = await client.models.Projectt.list({
    filter: { ClientID: { eq: clientID } },
  });

  const projects = projectsResult.data;
  if (!projects.length) return [];

  const projectIDs = projects.map((project) => project.projectID);

  // 3. Fetch all Forms for the found projects
  const allForms = await Promise.all(
    projectIDs.map(async (projectID) => {
      const formsResult = await client.models.Form.list({
        filter: { projID: { eq: projectID } },
      });

      const forms = formsResult.data;
      const formIDs = forms.map((form) => form.id);

      const formDetailsWithEquipment = await Promise.all(
        formIDs.map(async (formId) => {
          const { data: formTags, errors: formTagsErrors } =
            await client.models.FormTag2.list({
              filter: { formID: { eq: formId } },
            });

          if (formTagsErrors) {
            console.error(
              `Error fetching form tags for form ID ${formId}:`,
              formTagsErrors,
            );
            return null;
          }

          const tagIDs = formTags.map((tag) => tag.tagID);

          const equipmentAndTags = await Promise.all(
            tagIDs.map(async (tagID) => {
              const { data: equipmentData, errors: equipmentErrors } =
                await client.models.EquipmentTag2.list({
                  filter: tagID ? { id: { eq: tagID } } : undefined,
                });

              if (equipmentErrors) {
                console.error(
                  `Error fetching equipment for tagID ${tagID}:`,
                  equipmentErrors,
                );
                return null;
              }

              return equipmentData.map((equipment) => ({
                equipmentName: equipment.EquipmentName,
                equipmentTag: equipment.Tag,
                tagCreatedAt: new Date(equipment.createdAt)
                  .toISOString()
                  .split("T")[0], // <-- Adicionado aqui
              }));
            }),
          );

          const formData = forms.find((form) => form.id === formId);
          return {
            clientName: clientData.ClientName,
            projectName: projects.find(
              (project) => project.projectID === projectID,
            )?.projectName,
            projectID,
            formName: formData?.name,
            equipment: equipmentAndTags.flat(),
            submission: formData?.submissions || 0,
            description: formData?.description,
            formId: formId,
          };
        }),
      );

      return formDetailsWithEquipment.filter((detail) => detail !== null);
    }),
  );

  const flattenedForms = allForms.flat();

  return flattenedForms.map((formDetail) => ({
    clientName: formDetail.clientName,
    projectName: formDetail.projectName,
    projectID: formDetail.projectID,
    formID: formDetail.formId,
    formName: formDetail.formName,
    description: formDetail.description,
    equipmentDetails: formDetail.equipment.map((equipment) => ({
      equipmentName: equipment?.equipmentName || "Unknown",
      equipmentTag: equipment?.equipmentTag || "Unknown",
      tagCreatedAt: equipment?.tagCreatedAt || "Unknown", // <-- Adicionado aqui também
    })),
    submission: formDetail.submission,
  }));
}

/*await GetFormsByClientName("Rio Tinto")
  .then((flattenedForms) => {
    console.log("✅ Forms from client:", flattenedForms);
  })
  .catch((error) => {
    console.error("❌ Error fetching forms:", error);
  });*/

export async function SaveFormAfterTest(
  FormID: string,
  TagID: string,
  content: string,
) {
  try {
    const { data: formTags, errors } = await client.models.FormTag2.list({
      filter: {
        formID: { eq: FormID },
        tagID: { eq: TagID },
      },
    });

    if (errors) {
      console.error("Error:", errors);
      return;
    }

    const formTagToUpdate = formTags[0];

    if (!formTagToUpdate) {
      console.error("Nothing found for this formID and tagID");
      return;
    }

    const updated = await client.models.FormTag2.update({
      id: formTagToUpdate.id,
      contentTest: content,
    });

    console.log("Updated:", updated);
    return updated;
  } catch (err) {
    console.error("Error SaveFormAfterTest:", err);
  }
}

/*  SaveFormAfterTest("96a34ca0-03a2-4f79-8853-495e7ea3d060", "40df5981-e8d0-45e1-b8f4-9922f5ccce52", "Test content")
.then((updatedForm) => {
  console.log("Form updated successfully:", updatedForm);
})
.catch((error) => {
  console.error("Error updating form:", error);
});*/

export async function getContentByFormIDandTagID(
  FormID: string,
  TagID: string,
) {
  try {
    const { data: formTags, errors } = await client.models.FormTag2.list({
      filter: {
        formID: { eq: FormID },
        tagID: { eq: TagID },
      },
    });

    if (errors) {
      console.error("Error:", errors);
      return;
    }

    const formTag = formTags[0];

    if (!formTag) {
      console.error("Nothing found for this formID and tagID");
      return;
    }

    const content = formTag.contentTest;

    //console.log("Fetched content:", content);
    return content;
  } catch (err) {
    console.error("Error getContentByFormIDandTagID:", err);
  }
}

/*getContentByFormIDandTagID("2e069dfa-3e6d-42d2-be06-544b5aa99b40", "9399935a-59ea-413f-8303-41b8fc4f97b7")
.then((updatedForm) => {
  console.log("Form updated successfully:", updatedForm);
})
.catch((error) => {
  console.error("Error updating form:", error);
});*/

export async function getEquipmentTagID(
  equipmentName: string,
  equipmentTag: string,
) {
  try {
    // Query to fetch equipment by its name and tag
    const { data, errors } = await client.models.EquipmentTag2.list({
      filter: {
        EquipmentName: { eq: equipmentName },
        Tag: { eq: equipmentTag },
      },
    });

    // Check for errors
    if (errors) {
      console.error("Error fetching equipment tag:", errors);
      return;
    }

    // Check if data exists
    const equipmentTagData = data[0]; // Assuming the first entry matches the search
    if (!equipmentTagData) {
      console.error("No matching equipment found for given name and tag.");
      return;
    }

    // Return the equipmentTagID
    return equipmentTagData.id; // Assuming `id` is the equipmentTagID
  } catch (err) {
    console.error("Error in getEquipmentTagID:", err);
  }
}

/*getEquipmentTagID("Equip1", "Tag1")
.then((updatedForm) => {
  console.log("Equip TAG ID:", updatedForm);
})
.catch((error) => {
  console.error("Error updating form:", error);
});*/
