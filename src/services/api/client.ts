import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export { client as apiClient };
