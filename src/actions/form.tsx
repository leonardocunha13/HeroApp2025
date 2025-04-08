import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from 'aws-amplify/auth'; // Ensure getCurrentUser is imported correctly
//import { string } from 'zod';
//import { formSchemaType } from "../schemas/form";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// UserNotFoundErr class for custom error handling
class UserNotFoundErr extends Error { }

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
    const projectNames = projects.map(project => project.projectName);
    // Return client and associated projects
    return { projectNames };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


/*GetProjectsFromClientName("Rio Tinto")
  .then((data) => console.log("Client with Projects:", data))
  .catch((error) => console.error("Error fetching client with projects:", error));*/

/*export async function InsertProject(NameProject: string, IDProject: string, ClientID: string) {
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
InsertProject("Cage Winder Execute Phase" , "HE067P010", "b10e95f7-92b6-4358-9ae2-e0a1c639f475");*/

/* export async function AddEquipmentToForm(formId: string, equipmentTag: string) {
   try {
     // Create a new EquipmentTag directly without checking for existing tags
     const { errors: createTagErrors, data: newEquipmentTag } = await client.models.EquipmentTag.create({
       Tag: equipmentTag, // Creating a new EquipmentTag with the provided name
     });
     console.log("New EquipmentTag:", newEquipmentTag);
     if (createTagErrors) {
       console.error("Error creating new equipment tag:", createTagErrors);
       throw new Error("Something went wrong while creating the equipment tag");
     }
 
     // Ensure newEquipmentTag is valid
     if (!newEquipmentTag) {
       console.error("Error: New equipment tag is null or undefined");
       throw new Error("Failed to create new equipment tag.");
     }
 
     // Get the ID of the newly created EquipmentTag
     const equipmentTagId = newEquipmentTag.id;
 
     // Now associate the newly created EquipmentTag with the form
     const { errors: formTagErrors, data: formTag } = await client.models.FormTag.create({
       formID: formId,
       tagID: equipmentTagId, // Link the newly created EquipmentTag to the Form
     });
 
     if (formTagErrors) {
       console.error("Error associating equipment with form:", formTagErrors);
       throw new Error("Something went wrong while associating the equipment tag with the form");
     }
 
     console.log("Created FormTag:", formTag);
     return newEquipmentTag; // Return the created FormTag for further use or confirmation
   } catch (error) {
     console.error("Error in AddEquipmentToForm:", error);
     throw error;
   }
 }
 
 
 await AddEquipmentToForm("3cf67384-5113-4be5-9e5e-674712778e13", "Test Tag 1")
 .then((newEquipmentTag) => console.log("Created FormTag:", newEquipmentTag))
 .catch((error) => console.error("Error:", error)); // Handle any errors that occur*/

export async function CreateForm(name: string, description: string, projectName: string) {
  const { userId } = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }

  // Fetch the project details using projectName
  const { errors: projectErrors, data: projectsData } = await client.models.Projectt.list({
    filter: { projectName: { eq: projectName } }
  });

  if (projectErrors) {
    console.error("Error fetching projects:", projectErrors);
    throw new Error("Failed to fetch projects.");
  }

  if (projectsData.length === 0) {
    throw new Error(`Project with name "${projectName}" not found.`);
  }

  // Get the first matching project's ID (assuming project names are unique)
  const projID = projectsData[0].projectID;

  // Now create the form using projID
  const { errors: formerrors , data: form } = await client.models.Form.create({
    userId: userId,
    projID: projID,  // Here, we are using the found projID from the project lookup
    name: name,      // Use the form name from the state
    description: description,
  });

  if (formerrors) {
    console.error("Error creating form:", formerrors);
    throw new Error("Something went wrong while creating the form");
  }

  return form?.id;  // Return the created form ID
};

export const runForm = async (TestName: string, ProjectID: string, EquipName: string, EquipTag: string): Promise<boolean> => {
  try {
    // Fetch the form based on TestName and ProjectID
    //console.log("Fetching form with TestName:", TestName, "and ProjectID:", ProjectID);
    const formResp = await fetchFormByNameAndProject(TestName, ProjectID);

    if (!formResp) {
      console.error("Form not found with the provided TestName and ProjectID");
      return false; // Return false if the form is not found
    }

    //console.log("Form fetched successfully:", formResp);
    const form = formResp;

    // Verifies if the EquipmentTag with this Tag + EquipmentName already exists for the same form and project
    //console.log("Checking if EquipmentTag exists for Tag:", EquipTag, "and EquipmentName:", EquipName, "in the same form and project");

    const existingTagResp = await client.models.EquipmentTag2.list({
      filter: {
        Tag: { eq: EquipTag },  // Case-sensitive check for EquipTag
        EquipmentName: { eq: EquipName },  // Case-sensitive check for EquipmentName
      },
    });

    //console.log("Existing EquipmentTag response:", existingTagResp);

    // If any EquipmentTag exists for this EquipTag and EquipmentName, check if it's linked to the same form
    const existingTag = existingTagResp.data?.[0];

    if (existingTag) {
      // Check if the EquipmentTag is already linked to the same form and project
      const linkedFormResp = await client.models.FormTag2.list({
        filter: {
          tagID: { eq: existingTag.id },
          formID: { eq: form.id },  // Check if it's the same form
        },
      });

      // If the EquipmentTag is already linked to the same form, block form start
      if (linkedFormResp.data?.length > 0) {
        console.error("Error: This equipment and tag are already associated with this form and project.");
        alert("Error: This equipment and tag are already associated with this form and project.");
        return false;  // Prevent proceeding with the form creation
      }

      // Otherwise, allow form to proceed for a different form
      //console.log("Allowing form to proceed as EquipmentTag is linked to a different form.");
    }

    // If the EquipmentTag does not exist, create it
    let createResp = null; // Declare createResp outside the block
    if (!existingTag) {
      //console.log('Creating new EquipmentTag with Tag:', EquipTag, 'and EquipmentName:', EquipName);
      createResp = await client.models.EquipmentTag2.create({
        Tag: EquipTag,
        EquipmentName: EquipName,
      });

      if (!createResp.data) {
        console.error('Failed to create EquipmentTag');
        //console.log("Create Response:", createResp);  // Log the full response to check for details
        return false; // Return false if creating the equipment tag fails
      }

      //console.log('New EquipmentTag created:', createResp.data);
    }

    // Create the link between the Form and EquipmentTag (FormTag)
    //console.log('Creating FormTag to link form with EquipmentTag');
    const formTagResp = await client.models.FormTag2.create({
      formID: form.id,
      tagID: existingTag ? existingTag.id : createResp?.data?.id, // Use existing or newly created tagID
    });

    if (!formTagResp.data) {
      console.error('Failed to create FormTag');
      return false; // Return false if the form tag creation fails
    }

    //console.log('FormTag created successfully:', formTagResp.data);
    //console.log('Form executed successfully and linked to the EquipmentTag.');

    return true; // Return true if everything succeeds

  } catch (error) {
    console.error('Error executing runForm:', error);
    return false; // Return false if any error occurs
  }
};



// Fetch formId by TestName and ProjectID
const fetchFormByNameAndProject = async (TestName: string, ProjectID: string) => {
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


// form.tsx

export async function GetFormsByClientName(ClientName: string) {
  // 1. Fetch the Client ID
  const clientResult = await client.models.Client.list({
    filter: {
      ClientName: { eq: ClientName }
    },
  });
  //console.log("Client Result:", clientResult);

  const clientData = clientResult.data?.[0];
  if (!clientData) return [];

  const clientID = clientData.id;
  //console.log("Client ID:", clientID);

  // 2. Fetch all Projects with the corresponding ClientID
  const projectsResult = await client.models.Projectt.list({
    filter: {
      ClientID: { eq: clientID }
    }
  });

  const projects = projectsResult.data;
  if (!projects.length) return [];
  //console.log("Projects Found:", projects);

  // Extract project IDs
  const projectIDs = projects.map(project => project.projectID);
  //console.log("Project IDs:", projectIDs);

  // 3. Fetch all Forms for the found projects
  const allForms = await Promise.all(
    projectIDs.map(async (projectID) => {
      const formsResult = await client.models.Form.list({
        filter: { projID: { eq: projectID } },
      });
      //console.log(`Forms for Project ${projectID}:`, formsResult);

      const forms = formsResult.data;
      const formIDs = forms.map(form => form.id);
      //console.log("Form IDs:", formIDs);

      // Fetch tagID related to each FormID and then get equipment and tags
      const formDetailsWithEquipment = await Promise.all(
        formIDs.map(async (formId) => {
          // Fetch the tagID for the current FormID from FormTag2
          const { data: formTags, errors: formTagsErrors } = await client.models.FormTag2.list({
            filter: { formID: { eq: formId } },
          });

          if (formTagsErrors) {
            console.error(`Error fetching form tags for form ID ${formId}:`, formTagsErrors);
            return null;
          }

          // Extract tagIDs
          const tagIDs = formTags.map(tag => tag.tagID);
          //console.log("Tag IDs for FormID:", formId, tagIDs);

          // Fetch equipment and tags based on tagIDs
          const equipmentAndTags = await Promise.all(
            tagIDs.map(async (tagID) => {
              const { data: equipmentData, errors: equipmentErrors } = await client.models.EquipmentTag2.list({
                filter: tagID ? { id: { eq: tagID } } : undefined,
              });

              if (equipmentErrors) {
                console.error(`Error fetching equipment for tagID ${tagID}:`, equipmentErrors);
                return null;
              }

              return equipmentData.map(equipment => ({
                equipmentName: equipment.EquipmentName,
                equipmentTag: equipment.Tag,
              }));
            })
          );

          // Combine form data with its equipment and tags
          const formData = forms.find(form => form.id === formId);

          return {
            clientName: clientData.ClientName, // Adding Client Name
            projectName: projects.find(project => project.projectID === projectID)?.projectName, // Adding Project Name
            projectID, // Adding Project ID
            formName: formData?.name, // Adding Form Name
            equipment: equipmentAndTags.flat(),
          };
        })
      );

      return formDetailsWithEquipment.filter(detail => detail !== null);
    })
  );

  // Flatten the array of arrays of forms and enrich the data
  const flattenedForms = allForms.flat();
  //console.log("Flattened Forms with Equipment and Tags:", flattenedForms);

  // Flatten and return the result with all the required information
  return flattenedForms.map(formDetail => ({
    clientName: formDetail.clientName,
    projectName: formDetail.projectName,
    projectID: formDetail.projectID,
    formName: formDetail.formName,
    equipmentDetails: formDetail.equipment.map(equipment => ({
      equipmentName: equipment?.equipmentName || "Unknown",
      equipmentTag: equipment?.equipmentTag || "Unknown",
    })),
  }));
}

/*await GetFormsByClientName("Rio Tinto")
  .then((flattenedForms) => {
    console.log("✅ Forms from client:", flattenedForms);
  })
  .catch((error) => {
    console.error("❌ Error fetching forms:", error);
  });*/
