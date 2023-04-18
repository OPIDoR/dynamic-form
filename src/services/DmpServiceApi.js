import axios from 'axios';
import toast from 'react-hot-toast';

function createHeaders(csrf = null) {
  if (csrf) {
    return {
      headers: {
        'X-CSRF-Token': csrf,
        'Content-Type': 'application/json',
      },
    };
  }
}

export async function getFragment(id) {
  let response;
  try {
    response = await axios.get(`/madmp_fragments/${id}`, createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export async function loadForm(fragmentId) {
  let response;
  try {
    response = await axios.get(`/madmp_fragments/load_form/${fragmentId}`, createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export async function loadNewForm(schemaId, obj, researchId, questionId, planId, token) {
  let response;
  const plan_id = planId;
  const question_id = questionId;
  const research_output_id = researchId;
  const madmp_schema_id = schemaId;
  const dmp_id = obj.plan.dmp_id;
  try {
    response = await axios.get(
      `/madmp_fragments/load_new_form?madmp_fragment[answer][plan_id]=:${plan_id}&madmp_fragment[answer][question_id]=:${question_id}&madmp_fragment[answer][research_output_id]=:${research_output_id}&madmp_fragment[schema_id]=:${madmp_schema_id}&madmp_fragment[dmp_id]=:${dmp_id}`,
      createHeaders()
    );

  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export async function getSchema(id) {
  let response;
  try {
    response = await axios.get(`/madmp_schemas/${id}`, createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export async function getRegistry(id) {
  let response;
  try {
    response = await axios.get(`/registries/${id}`, createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export async function getContributors(dmpId, templateId) {
  let response;
  try {
    response = await axios.get(`/madmp_fragments/load_fragments?dmp_id=${dmpId}&schema_id=${templateId}`, createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

/**
 * It sends a POST request to the server with the jsonObject as the body of the request.
 * </code>
 * @param jsonObject - the data you want to send to the server
 * @returns The response object from the server.
 */
export async function saveForm(id, jsonObject) {
  let response;
  const csrf = document.querySelector('meta[name="csrf-token"]').content;
  try {
    response = await axios.post(`/madmp_fragments/update_json/${id}`, jsonObject, createHeaders(csrf));
  } catch (error) {
    if (error.response) {
      toast.error(error.response.message);
    } else if (error.request) {
      toast.error(error.request);
    } else {
      toast.error(error.message);
    }
  }
  return response;
}
