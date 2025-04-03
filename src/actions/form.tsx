import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from 'aws-amplify/auth'; // Ensure getCurrentUser is imported correctly
import { formSchemaType } from "../schemas/form";

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



// Function to insert a single project (you may already have something like this)
export async function InsertProject(name: string, projNum: string, clientID: string) {
  try {
    const { errors, data } = await client.models.Project.create({
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
}

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



const clientNames = ["Client1","Client2", "Client3","Client4"]; // Example client names

InsertMultipleClients(clientNames)
  .then((result) => {
    console.log("Successfully inserted clients:", result.insertedClients);
    console.log("Failed to insert clients:", result.failedClients);
  })
  .catch((error) => {
    console.error("Error inserting clients:", error);
  });

  export async function GetClients() {
    try {
      const { errors, data } = await client.models.Client.list();
  
      if (errors) {
        console.error("Error:", errors);
        throw new Error("Failed to fetch clients.");
      }
  
      // Extract client names and client IDs
      const clientNames = data.map(client => client.ClientName);
      const clientIDs = data.map(client => client.id);
  
      // Return both client names and IDs in an object or an array
      return {
        clientNames,
        clientIDs
      };
  
      // Alternatively, if you want to return an array:
      // return [clientNames, clientIDs];
  
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async function fetchData() {
    const clients = await GetClients();
    const cID = clients.clientIDs;
    console.log(cID);
    const projects = ["project1", "project2", "project3", "project4"];
    const projNumbers = ["projNumber1", "projNumber2", "projNumber3", "projNumber4"];
  
    await InsertProject(projects[0], projNumbers[0], cID[0]);
    await InsertProject(projects[1], projNumbers[1], cID[1]);
    await InsertProject(projects[2], projNumbers[2], cID[2]);
    await InsertProject(projects[3], projNumbers[3], cID[3]);
  }
  
  fetchData().catch(console.error);
  
  

export async function GetProjects() {
  try {
    const { errors, data } = await client.models.Project.list();
    
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

export async function CreateForm(data: formSchemaType) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { errors, data: form } = await client.models.Form.create({
      userId: userId,
      name: data.name,
      description: data.description,
      
    });

    if (errors) {
      console.error("Error creating form:", errors);
      throw new Error("Something went wrong while creating the form");
    }

    return form?.id;
  } catch (error) {
    console.error("Error in CreateForm:", error);
    throw new Error("Failed to create form.");
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


export async function GetFormsInformation() {
  try {
    const { errors: clientErrors, data: clientsData } = await client.models.Client.list();

    if (clientErrors) {
      console.error("Error:", clientErrors);
      throw new Error("Failed to fetch forms.");
    }

    let results = [];

    for (const clientItem of clientsData) {
      const { errors: projectErrors, data: projectsData } = await client.models.Project.list({
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
