import { Amplify } from 'aws-amplify';
import { useState, useEffect } from "react";
import outputs from '../amplify_outputs.json';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from 'aws-amplify/auth'; // Make sure getCurrentUser is imported correctly



Amplify.configure(outputs);

const client = generateClient<Schema>();

// UserNotFoundErr class for custom error handling
class UserNotFoundErr extends Error { }

export default function GetFormStats() {
  const [formStats, setFormStats] = useState({
    visits: 0,
    submissions: 0,
    submissionRate: 0,
    bounceRate: 0,
  });
  const [userId, setUserId] = useState<string | null>(null); // State for userId

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const { userId } = await getCurrentUser(); // Destructure directly here
      if (!userId) {
        throw new UserNotFoundErr();
      }
      setUserId(userId); // Store userId in state
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Fetch form stats only if userId is available
  const fetchFormStats = async () => {
    if (!userId) {
      return; // Prevent fetching stats if userId isn't set
    }

    try {
      // Fetch all forms associated with the current user
      const { data: forms, errors } = await client.models.Form.list();

      if (errors) {
        console.error(errors);
        return;
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

      // Set the stats to state
      setFormStats({
        visits,
        submissions,
        submissionRate,
        bounceRate,
      });
    } catch (error) {
      console.error("Error fetching form stats:", error);
    }
  };

  // Fetch user info and form stats on mount
  useEffect(() => {
    fetchCurrentUser(); // Get the current user info
  }, []); // Empty dependency array, so it runs only once when the component mounts

  useEffect(() => {
    if (userId) {
      fetchFormStats(); // Fetch stats only if userId is available
    }
  }, [userId]); // Runs when userId changes


  return (
    <div>
      <h1>Form Stats</h1>
      <p>Visits: {formStats.visits}</p>
      <p>Submissions: {formStats.submissions}</p>
      <p>Submission Rate: {formStats.submissionRate.toFixed(2)}%</p>
      <p>Bounce Rate: {formStats.bounceRate.toFixed(2)}%</p>
    </div>
  );
}

export async function CreateForm(name: string, description:string, projID:string) {
 
  const {userId} = await getCurrentUser();
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

/*CreateForm("Test name 5", "Test description 5", "6f20f3be-b793-4542-bfce-9aa0b3e1c392")
  .then((formId) => console.log("Created Form ID:", formId)) 
  .catch((error) => console.error("Error creating form:", error));*/

export async function GetForms() {
  
  const {userId} = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }
  // Fetch all forms associated with the current user using Amplify's Data API
  const { data: forms, errors } = await client.models.Form.list({
    filter: { userId: { eq: userId } }, // Filter by userId
  });
  
  if (errors) {
    console.error(errors);
    return []; // Return an empty array if there's an error
  }

  return forms; // Return the fetched forms
}

export async function GetFormById(id: string) {
  const {userId} = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }
  // Fetch a specific form by its ID for the current user
  const { data: form, errors } = await client.models.Form.get({
    id,
  });
  if (errors) {
    console.error(errors);
    return null;
  }
  // Ensure the form belongs to the current user
  if (form && form.userId === userId) {
    return form;
  }
  throw new Error("Form not found or doesn't belong to the current user.");
}

//Update function to update the form content
export async function UpdateFormContent(id: string, content: string) {
  const {userId} = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }
  const form = {
    id: id,
    userId: userId,
    content: content
  }
  // Update form content for the current user
  const { data: updatedForm, errors } = await client.models.Form.update(form);
  if (errors) {
    console.error(errors);
    throw new Error("Failed to update form content.");
  }

  return updatedForm;
}

//###Function to publish new form
export async function PublishForm(id: string) {
  const {userId} = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }
  const form = {
    id: id,
    userId: userId,
    published: true

  }
  // Publish the form for the current user
  const { data: updatedForm, errors } = await client.models.Form.update(form)
  if (errors) {
    console.error(errors);
    throw new Error("Failed to publish the form.");
  }
  return updatedForm;
}

export async function GetFormContentByUrl(formUrl: string) {
  const {userId} = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }
  // Fetch the form that matches the given shareURL
  const { data: forms, errors } = await client.models.Form.list({
    filter: { shareURL: { eq: formUrl } },
  });
  // Handle errors or if no form is found
  if (errors || !forms || forms.length === 0) {
    console.error(errors || "Form not found.");
    throw new Error("Form not found.");
  }

  const form = forms[0]; // Get the first form (assuming shareURL is unique)
  const updatedVisits = form.visits ? form.visits + 1 : 1; // Default to 1 if visits is null or undefined
  // Increment the visits count by 1
  const updatedForm = {
    id: form.id,
    visits: updatedVisits, // Increment visits
  };

  // Update the form with the incremented visits field
  const { errors: updateErrors } = await client.models.Form.update(updatedForm);

  // Handle errors during the update operation
  if (updateErrors) {
    console.error(updateErrors);
    throw new Error("Failed to update form visits.");
  }

  // Return the form content
  return form.content;
}

export async function SubmitForm(formUrl: string, content: string) {
  // Step 1: Fetch the Form using `filter` by `shareURL`
  const {data: forms} = await client.models.Form.list({
    filter: {
      shareURL: { eq: formUrl },  // Filter the form by its shareURL
      published: { eq: true },    // Ensure that the form is published
    },
  });
  const form = forms[0]; // Get the first form from the result
  // Step 2: Create a new FormSubmission
  const newFormSubmission = await client.models.FormSubmissions.create({
    formId: form.id,  // Link the submission to the form via formId
    content: content, // The content of the submission
  });

  // Step 3: Update the Form's submissions count
  const updatedSubmissions = form.submissions ? form.submissions + 1 : 1; // Default to 1 if visits is null or undefined

    const updatedForm = await client.models.Form.update({
    id: form.id,  // Identify the form by its ID
    submissions: updatedSubmissions,  // Update the submission count
  });

  // Return the updated form and the new form submission
  return {
    form: updatedForm,
    newSubmission: newFormSubmission,
  };
}

export async function GetFormWithSubmissions(id: string) {
  const {userId} = await getCurrentUser();
  if (!userId) {
    throw new UserNotFoundErr();
  }

  const { data: form, errors } = await client.models.Form.get({id});

  if (errors) {
    console.error(errors);
    return null;
  }

  // Ensure the form belongs to the current user
  if (form && form.userId === userId) {
    // Fetch associated form submissions
    const { data: submissions, errors: submissionErrors } = await client.models.FormSubmissions.list({
      filter: { formId: { eq: form.id } },
    });

    if (submissionErrors) {
      console.error(submissionErrors);
    }

    return { ...form, submissions };
  }

  throw new Error("Form not found or doesn't belong to the current user.");
}

export async function InsertClient(NameClient: string) {
  try {
    const { errors, data } = await client.models.Client.create({
      ClientName: NameClient,
    });

    if (errors) {
      console.error("Error:", errors);
      throw new Error("Failed to insert client.");
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
//InsertClient("FMG");

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

//InsertProject("Waitsia Gas Plant EI Support" , "HE102P001", "27a41e74-4ab0-4f13-a347-95ebb7dcbab0");

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
          console.log ('Project ID:', project.projectID);
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
    
  GetFormsWithClient("1ad74bce-bd9d-4131-83ef-effecba74c7d")
  .then((forms) => console.log("Forms:", forms))
  .catch((error) => console.error("Error:", error));



  

