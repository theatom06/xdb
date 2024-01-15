# XDB
This is a basic Node.js HTTP server that provides key-value store functionality. The server allows you to create, retrieve, store, update, and delete data using simple HTTP requests.

## Usage

1. Install the vx.x.x-xdb.bun.js file 
2. Run the file in 

## Api

_NOTE: ALL THE ENDPOINTS USE GET REQUESTS_

### 1. Create a new file:

```http
/new?id={fileId}
```

Creates a new JSON file in the specified directory (_see Configuration_).

### 2. Retrieve data:
```http
/{fileId}/get/?id={key}
```
Retrieves the value associated with the specified key from the JSON file.

### 3. Store data:
```http
/{fileId}/store/?id={key}&data={value}
```
Stores the provided key-value pair in the JSON file.

### 4. Update data (PATCH):
```http
/{fileId}/patch/?id={key}&data={value}
```

Updates the value associated with the specified key in the JSON file.

### 5. Delete data:
```http
GET /{fileId}/delete/?id={key}
```

Deletes the key-value pair with the specified key from the JSON file.

## Configuration

- `PORT`: The port on which the server listens (default is 9052).

- `DIR` : The directory where JSON files are stored (default is 'db').

xdb v1.0.0