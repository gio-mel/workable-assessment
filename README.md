# workable-assessment
Tests can be found under integration directory. To run them in browser go to project directory and run `npm run cypress:open`.
Electron is recommended because of some issues with chrome:

<img width="273" alt="Screenshot 2021-10-20 at 5 16 50 PM" src="https://user-images.githubusercontent.com/92848796/138110723-1856a8e2-0ba2-4870-91ab-c678162fac1b.png">

For headless mode use `npm run cypress:run`.

Notes: 
Not all citeria were automated due to time restrictions.
One test is skipped because of flakiness (strange begavior of taskDB search bar).
Drag and drop wasn't automated, several trials failed. Demanded further investigation.
