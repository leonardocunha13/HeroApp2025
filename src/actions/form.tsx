import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from 'aws-amplify/auth'; // Ensure getCurrentUser is imported correctly
//import { formSchemaType } from "../schemas/form";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// UserNotFoundErr class for custom error handling
class UserNotFoundErr extends Error { }

export async function InsertClient(NameClient: string) {
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
}

export async function InsertMultipleClients(names: string[]) {
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
}

/*const clientNames = ["Client1", "Client2", "Client3"]; // Example client names

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

    const clientNames = data.map(client => client.ClientName);

    return clientNames;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function GetProjects() {
  try {
    const { errors, data } = await client.models.Projectt.list();

    if (errors) {
      console.error("Error:", errors);
      throw new Error("Failed to fetch projects.");
    }

    // Separate projectIDs and projectNames
    const projectIDs = data.map(project => project.projectID); // List of all projectIDs
    const projectNames = data.map(project => project.projectName); // List of all projectNames

    // Return both separately
    return { projectIDs, projectNames };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


export async function GetFormStats() {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    // Fetch all forms associated with the current user
    const { data: forms, errors } = await client.models.Form.list();

    if (errors) {
      console.error(errors);
      return { visits: 0, submissions: 0, submissionRate: 0, bounceRate: 0 };
    }

    // Filter forms belonging to the current user
    const userForms = forms.filter((form) => form.userId === userId);

    // Calculate the stats
    const visits = userForms.reduce((sum, form) => sum + (form.visits || 0), 0);
    const submissions = userForms.reduce(
      (sum, form) => sum + (form.submissions || 0),
      0
    );

    let submissionRate = 0;
    if (visits > 0) {
      submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    // Return the stats object
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
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    // Fetch all forms associated with the current user
    const { data: forms, errors } = await client.models.Form.list({
      filter: { userId: { eq: userId } },
    });

    if (errors) {
      console.error(errors);
      return [];
    }

    return forms;
  } catch (error) {
    console.error("Error fetching forms:", error);
    return [];
  }
}

export async function GetFormById(id: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { data: form, errors } = await client.models.Form.get({
      id,
    });

    if (errors) {
      console.error(errors);
      return null;
    }

    if (form && form.userId === userId) {
      return form;
    }

    throw new Error("Form not found or doesn't belong to the current user.");
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return null;
  }
}

export async function UpdateFormContent(id: string, content: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const form = {
      id: id,
      userId: userId,
      content: content,
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

export async function PublishForm(id: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const form = {
      id: id,
      userId: userId,
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

export async function GetFormContentByUrl(formUrl: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { data: forms, errors } = await client.models.Form.list({
      filter: { shareURL: { eq: formUrl } },
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

    const { errors: updateErrors } = await client.models.Form.update(updatedForm);

    if (updateErrors) {
      console.error(updateErrors);
      throw new Error("Failed to update form visits.");
    }

    return form.content;
  } catch (error) {
    console.error("Error fetching form content by URL:", error);
    throw new Error("Error fetching form content by URL.");
  }
}

export async function SubmitForm(formUrl: string, content: string) {
  try {
    const { data: forms } = await client.models.Form.list({
      filter: {
        shareURL: { eq: formUrl },
        published: { eq: true },
      },
    });

    const form = forms[0];

    const newFormSubmission = await client.models.FormSubmissions.create({
      formId: form.id,
      content: content,
    });

    const updatedSubmissions = form.submissions ? form.submissions + 1 : 1;

    const updatedForm = await client.models.Form.update({
      id: form.id,
      submissions: updatedSubmissions,
    });

    return {
      form: updatedForm,
      newSubmission: newFormSubmission,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw new Error("Failed to submit the form.");
  }
}

export async function GetFormWithSubmissions(id: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { data: form, errors } = await client.models.Form.get({ id });

    if (errors) {
      console.error(errors);
      return null;
    }

    if (form && form.userId === userId) {
      const { data: submissions, errors: submissionErrors } = await client.models.FormSubmissions.list({
        filter: { formId: { eq: form.id } },
      });

      if (submissionErrors) {
        console.error(submissionErrors);
      }

      return { ...form, submissions };
    }

    throw new Error("Form not found or doesn't belong to the current user.");
  } catch (error) {
    console.error("Error fetching form with submissions:", error);
    throw new Error("Failed to fetch form with submissions.");
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
    const { data: projects, errors: projectErrors } = await client.models.Projectt.list({
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
    const { data: projects, errors: projectErrors } = await client.models.Projectt.list({
      filter: { ClientID: { eq: ClientID } }
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
          filter: { projID: { eq: project.projectID } }
        });
        console.log('Project ID:', project.projectID);
        console.log(`Forms for Project ${project.projectName}:`, projectForms);

        return projectForms.map(form => ({
          ...form,
          projectName: project.projectName
        }));
      })
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
    const { errors: clientErrors, data: clientsData } = await client.models.Client.list();

    if (clientErrors) {
      console.error("Error:", clientErrors);
      throw new Error("Failed to fetch forms.");
    }

    let results = [];

    for (const clientItem of clientsData) {
      const { errors: projectErrors, data: projectsData } = await client.models.Projectt.list({
        filter: { ClientID: { eq: clientItem.id } },
      });

      if (projectErrors) {
        console.error("Error:", projectErrors);
        throw new Error("Error fetching projects");
      }

      for (const projectItem of projectsData) {
        //console.log(`Fetching forms for project: ${projectItem.projectName}, ID: ${projectItem.projectID}`);

        const { errors: formErrors, data: formsData } = await client.models.Form.list({
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
          forms: formsData.map(form => ({
            name: form.name,
            description: form.description,
          })),
        });
      }
    }

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
      filter: { ClientName: { eq: ClientName } }
    });

    if (errors || clientData.length === 0) {
      console.error("Error fetching client or client not found:", errors);
      throw new Error("Client not found.");
    }

    // Assuming each client has an array of projects
    const Clients = clientData[0]; // Assuming the first client in the list is the one we're interested in
    const { data: projects, errors: projectErrors } = await client.models.Projectt.list({
      filter: { ClientID: { eq: Clients.id } },
    });

    if (projectErrors) {
      console.error("Error fetching projects:", projectErrors);
    }

    // Return client and associated projects
    return { ...Clients, projects };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


/*GetProjectsFromClientName("BHP")
  .then((data) => console.log("Client with Projects:", data))
  .catch((error) => console.error("Error fetching client with projects:", error));*/
  export async function InsertProject(NameProject: string, IDProject: string, ClientID: string) {
    try {
      const { errors, data } = await client.models.Projectt.create({
        projectName: NameProject,
        projectID: IDProject,
        ClientID: ClientID,
      });
  
      if (errors) {
        console.error("Error inserting project:", errors);
        throw new Error("Failed to insert project.");
      }
  
      console.log("Project inserted successfully:", data);
      return data; // Return the inserted project data
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  //InsertProject("Cage Winder Execute Phase" , "HE067P010", "741fa82d-6e1d-463c-a221-6565b2974a1a");

  export async function CreateForm(name: string, description: string, projID: string) {

    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }
  
    const { errors, data: form } = await client.models.Form.create({
      userId: userId,
      projID: projID,
      name: name, // Use the form name from the state
      description: description,
  
    });
  
    if (errors) {
      console.error("Error creating form:", errors);
      throw new Error("Something went wrong while creating the form");
    }
  
    return form?.id;  // Return the created form ID
  };
  
 /* CreateForm("Test name 12", "Test description 12", "HE101P001")
    .then((formId) => console.log("Created Form ID:", formId)) 
    .catch((error) => console.error("Error creating form:", error));*/