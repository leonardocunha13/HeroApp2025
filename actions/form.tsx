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

export async function CreateForm(name: string, description:string) {
 
    const {userId} = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { errors, data: form } = await client.models.Form.create({
      userId: userId,
      name: name, // Use the form name from the state
      description: description,
  
    });

    if (errors) {
      console.error("Error creating form:", errors);
      throw new Error("Something went wrong while creating the form");
    }

    return form?.id;  // Return the created form ID
  };

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