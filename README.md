# generator-bw_labs

Install
===============
Install yeoman generator tool first (if need)
```
npm install -g yo
```
Then run

```
npm install -g generator-bw_labs
```

Usage
================
Run yo bw_labs to create new bw_labs based project.

Run yo bw_labs --help to see all supported switches.



Run  yo bw_labs:enableDb  to add database support (if you didn't that before).

Run  yo bw_labs:enableViews  to add views support (if you didn't that before).

Run  yo bw_labs:enableAuth  to enable authentification support (it will install bw_labs.auth plugin and generate key file keys.yml).

Run  yo bw_labs:gulpFile  to generate gulpfile.js and enable gulp support  (if need)

Run  yo bw_labs:service *name*  to create new service file.

Run  yo bw_labs:model *name*  to create new model file.

Run  yo bw_labs:controller *name*  to create new controller file (run  yo bw_labs:controller __root  to generate root controller).

Run  yo bw_labs:migration *name*  to create new migration file.

Run  yo bw_labs:runGulp *args* to run installed local gulp with given options (with argument --harmony)
