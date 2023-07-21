const express = require('express');
const app = express();
app.get('/redirect', (req, res) => {
  // Redirect to a new page with the default status code (302 Found)
  res.redirect('/newpage');
});

app.get('/redirectWithStatus', (req, res) => {
  // Redirect to a new page with a custom status code (301 Moved Permanently)
  res.redirect(301, '/newpage');
});
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


//Api : http://localhost:4000/redirect
// Api link : http://localhost:4000/redirectWithStatus