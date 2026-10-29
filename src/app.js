
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });

  response.end(JSON.stringify(data));
}

export function handleRequest(request, response) {
  const url = new URL(
    request.url ?? '/',
    'http://localhost'
  );

  if (request.method !== 'GET') {
    sendJson(response, 405, {
      error: 'Method not allowed'
    });
    return;
  }

  if (url.pathname === '/health') {
    sendJson(response, 200, {
      status: 'ok'
    });
    return;
  }

  if (url.pathname === '/greet') {
    const name = url.searchParams.get('name')?.trim();

    if (!name) {
      sendJson(response, 400, {
        error: 'name is required'
      });
      return;
    }

    sendJson(response, 200, {
      message: `Hello, ${name}!`
    });
    return;
  }

  sendJson(response, 404, {
    error: 'Not found'
  });
}
