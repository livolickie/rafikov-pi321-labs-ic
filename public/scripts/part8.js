//Vue side
let vue = new Vue({
    el: '#app',
    data() { return {
        vacancies: [],
        editVacancy: {
            fio: "",
            birthday: "",
            city: "",
            shortStory: "",
            knownTechnologies: [],
            expectSalary: 0,
            targetJob: -1
        },
        tempJob: null,
        jobs: [],
        tempVacanciesModal: null,
        applyResumeModal: null
    }},
    computed: {
        tempVacancies() {
            if (!this.tempJob) return []
            return this.vacancies.filter(
                vacancy => vacancy.targetJob == this.tempJob.id
                )
        }
    },
    methods: {
        initializeModals() {
            this.tempVacanciesModal = M.Modal.init(document.querySelector('#modalVacancies'))
            this.applyResumeModal = M.Modal.init(document.querySelector('#modalApplyResume'))
        },
        setTempJob(job, applyResume = false) {
            this.tempJob = job
            this.editVacancy.targetJob = job.id
            if (applyResume) 
                this.applyResumeModal.open()
            else 
                this.tempVacanciesModal.open();
            // // setTimeout(() => {
            // //     M.AutoInit()
            // // })
            M.Datepicker.init(document.querySelectorAll(''))
        },
        async update() {
            this.vacancies = await (await fetch('/8/api?type=loadVacancies')).json()
            this.jobs = await (await fetch('/8/api?type=loadJobs')).json()
        },
        addVacancy(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Вы уверены?',
                text: "Вакансия будет добавлена на сайт!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Да, добавляем!',
                cancelButtonText: 'Нет, пока не надо!'
              }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            'Готово!',
                            'Ваша заявка добавлена.',
                            'success'
                        )

                        await fetch(`/8/api?type=uploadVacancy&vacancy=${JSON.stringify(this.editVacancy)}`)
                        
                        this.update()

                        this.editVacancy.knownTechnologies = []
                        this.editVacancy.expectSalary = 0
                        this.editVacancy.targetJob = -1
                        for(const [key, val] of Object.entries(this.editVacancy)) {
                            if (typeof this.editVacancy[key] == 'string')
                                this.editVacancy[key] = '' 
                        }
                    }
            })
        }
    },
    mounted() {
        this.update();
        this.initializeModals();
        M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {
            data: {
                'Уфа': null,
                'Москва': null,
                'Казань': null,
            },
        });
        M.Range.init(document.querySelectorAll("input[type=range]"));
        M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            // container: '.modal'
        });
    }
})