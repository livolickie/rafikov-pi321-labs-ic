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
            expectSalary: 0
        }
    }},
    methods: {
        async loadVacancies() {
            this.vacancies = await (await fetch('/8/api?type=loadVacancies')).json()
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
                        // this.vacancies.push({
                        //     fio: this.editVacancy.fio,
                        //     birthday: this.editVacancy.birthday,
                        //     city: this.editVacancy.city,
                        //     shortStory: this.editVacancy.shortStory,
                        //     knownTechnologies: this.editVacancy.knownTechnologies.join(', '),
                        //     expectSalary: this.editVacancy.expectSalary,
                        // })
                        
                        this.loadVacancies()

                        this.editVacancy.knownTechnologies = []
                        this.editVacancy.expectSalary = 0
                        for(const [key, val] of Object.entries(this.editVacancy)) {
                            if (typeof this.editVacancy[key] == 'string')
                                this.editVacancy[key] = '' 
                        }
                    }
            })
        }
    },
    mounted() {
        this.loadVacancies();
        M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {
            data: {
                'Уфа': null,
                'Москва': null,
                'Казань': null,
            }
        });
        M.Range.init(document.querySelectorAll("input[type=range]"));
        M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    }
})