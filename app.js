const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

let jobs = {};

app.post('/add', (req, res) => {
    const jobValue = req.query.jobValue || req.body.jobValue;
    const jobId = req.query.jobid || req.body.jobid;

    if (!jobValue || !jobId) {
        return res.status(400).json({ error: 'jobValue and jobId are required parameters' });
    }

    if (isNaN(jobValue)) {
        return res.status(400).json({ error: 'jobValue must be a number' });
    }

    jobs[jobId] = parseInt(jobValue, 10);

    req.session.jobs = jobs;

    res.status(200).json({ stat: 'ok' });
});

app.get('/all', (req, res) => {
    const startValue = req.query.jobValue;
    let filteredJobs = startValue
        ? Object.entries(req.session.jobs).filter(([jobId, jobValue]) => jobValue >= startValue)
        : Object.entries(req.session.jobs);

    const sortedJobs = filteredJobs.sort(([, a], [, b]) => a - b);

    res.json(sortedJobs);
});

app.post('/remove', (req, res) => {
    const jobId = req.query.jobid || req.body.jobid;

    if (!jobId) {
        return res.status(400).json({ error: 'jobId is a required parameter' });
    }

    if (!req.session.jobs[jobId]) {
        return res.status(404).json({ error: 'Job not found' });
    }

    delete req.session.jobs[jobId];

    res.status(200).json({ stat: 'ok' });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});


// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// let jobs = [];
// let cache = {};

// app.post('/add', (req, res) => {
//     let jobValue = req.query.jobValue || req.body.jobValue;
//     let jobId = req.query.jobid || req.body.jobid;
//     if (!jobValue || !jobId) {
//         return res.status(400).json({ error: 'jobValue and jobId are required parameters' });
//     }

//     if (isNaN(jobValue)) {
//         return res.status(400).json({ error: 'jobValue must be a number' });
//     }
//     jobs.push({ jobId, jobValue });
//     jobs.sort((a, b) => a.jobValue - b.jobValue);
//     cache = {};

//     res.status(200).json({ stat: 'ok' });
// });

// app.get('/all', (req, res) => {
//     let jobValue = req.query.jobValue;

//     if (!cache[jobValue]) {
//         cache[jobValue] = jobs.filter(job => job.jobValue >= jobValue);
//     }

//     res.status(200).json(cache[jobValue]);
// });

// app.post('/remove', (req, res) => {
//     let jobId = req.query.jobid || req.body.jobid;
//     if (!jobId) {
//         return res.status(400).json({ error: 'jobId is a required parameter' });
//     }

//     jobs = jobs.filter(job => job.jobId != jobId);
//     cache = {};

//     res.status(200).json({ stat: 'ok' });
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });
