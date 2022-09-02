$define('com.bsoft.mpiview.front.component.MergeSelect.MergeSelect', {
    tpl: true,
    css: 'com.bsoft.mpiview.front.component.MergeSelect.MergeSelect',
}, function (html) {
    Vue.component('merge-select', {
        template: html,
        props: {
            mpiIds: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                selectForm1All: true,
                selectForm2All: false,
                mergeFormData1: {
                    mpiId: '',
                    name: '',
                    idCard: '',
                    sex: '',
                    sexName: '',
                    birthDate: '',
                    patientPhone: '',
                    nationality: '',
                    nationalityName: '',
                    passPort: '',
                    ethnicGroup: '',
                    ethnicGroupName: '',
                    maritalStatus: '',
                    maritalStatusName: '',
                    occupationCategoryCode: '',
                    occupationCategoryName: '',
                    healthInsuranceCardId: '',
                    medicalInsuranceCategoryCode: '',
                    medicalInsuranceCategoryCodeName: '',
                    bloodCode: '',
                    bloodCodeName: '',
                    rhBloodCode: '',
                    rhBloodCodeName: '',
                    militaryId: '',
                    healthCardId: '',
                    citizenCard: '',
                    hongKongAndMaCaoTravelPermit: '',
                    selfExpenseCard: '',
                    unionPayCard: '',
                    taiWanTravelPermit: '',
                    educationCode: '',
                    educationCodeName: '',
                    healthRecordId: '',
                },
                mergeFormData2: {
                    mpiId: '',
                    name: '',
                    idCard: '',
                    sex: '',
                    sexName: '',
                    birthDate: '',
                    patientPhone: '',
                    nationality: '',
                    nationalityName: '',
                    passPort: '',
                    ethnicGroup: '',
                    ethnicGroupName: '',
                    maritalStatus: '',
                    maritalStatusName: '',
                    occupationCategoryCode: '',
                    occupationCategoryName: '',
                    healthInsuranceCardId: '',
                    medicalInsuranceCategoryCode: '',
                    medicalInsuranceCategoryCodeName: '',
                    bloodCode: '',
                    bloodCodeName: '',
                    rhBloodCode: '',
                    rhBloodCodeName: '',
                    militaryId: '',
                    healthCardId: '',
                    citizenCard: '',
                    hongKongAndMaCaoTravelPermit: '',
                    selfExpenseCard: '',
                    unionPayCard: '',
                    taiWanTravelPermit: '',
                    educationCode: '',
                    educationCodeName: '',
                    healthRecordId: '',
                },
                mergeForm1: {
                    mpiId: '',
                    name: '',
                    idCard: '',
                    sex: '',
                    sexName: '',
                    birthDate: '',
                    patientPhone: '',
                    nationality: '',
                    nationalityName: '',
                    passPort: '',
                    ethnicGroup: '',
                    ethnicGroupName: '',
                    maritalStatus: '',
                    maritalStatusName: '',
                    occupationCategoryCode: '',
                    occupationCategoryName: '',
                    healthInsuranceCardId: '',
                    medicalInsuranceCategoryCode: '',
                    medicalInsuranceCategoryCodeName: '',
                    bloodCode: '',
                    bloodCodeName: '',
                    rhBloodCode: '',
                    rhBloodCodeName: '',
                    militaryId: '',
                    healthCardId: '',
                    citizenCard: '',
                    hongKongAndMaCaoTravelPermit: '',
                    selfExpenseCard: '',
                    unionPayCard: '',
                    taiWanTravelPermit: '',
                    educationCode: '',
                    educationCodeName: '',
                    healthRecordId: '',
                },
                mergeForm2: {
                    mpiId: '',
                    name: '',
                    idCard: '',
                    sex: '',
                    sexName: '',
                    birthDate: '',
                    patientPhone: '',
                    nationality: '',
                    nationalityName: '',
                    passPort: '',
                    ethnicGroup: '',
                    ethnicGroupName: '',
                    maritalStatus: '',
                    maritalStatusName: '',
                    occupationCategoryCode: '',
                    occupationCategoryName: '',
                    healthInsuranceCardId: '',
                    medicalInsuranceCategoryCode: '',
                    medicalInsuranceCategoryCodeName: '',
                    bloodCode: '',
                    bloodCodeName: '',
                    rhBloodCode: '',
                    rhBloodCodeName: '',
                    militaryId: '',
                    healthCardId: '',
                    citizenCard: '',
                    hongKongAndMaCaoTravelPermit: '',
                    selfExpenseCard: '',
                    unionPayCard: '',
                    taiWanTravelPermit: '',
                    educationCode: '',
                    educationCodeName: '',
                    healthRecordId: '',
                },
                resultForm: {
                    mpiId: '',
                    name: '',
                    idCard: '',
                    sex: '',
                    sexName: '',
                    birthDate: '',
                    patientPhone: '',
                    nationality: '',
                    nationalityName: '',
                    passPort: '',
                    ethnicGroup: '',
                    ethnicGroupName: '',
                    maritalStatus: '',
                    maritalStatusName: '',
                    occupationCategoryCode: '',
                    occupationCategoryName: '',
                    healthInsuranceCardId: '',
                    medicalInsuranceCategoryCode: '',
                    medicalInsuranceCategoryCodeName: '',
                    bloodCode: '',
                    bloodCodeName: '',
                    rhBloodCode: '',
                    rhBloodCodeName: '',
                    militaryId: '',
                    healthCardId: '',
                    citizenCard: '',
                    hongKongAndMaCaoTravelPermit: '',
                    selfExpenseCard: '',
                    unionPayCard: '',
                    taiWanTravelPermit: '',
                    educationCode: '',
                    educationCodeName: '',
                    healthRecordId: '',
                },
                resultIdForm: {
                    mpiId: '',
                    name: '',
                    idCard: '',
                    sex: '',
                    birthDate: '',
                    patientPhone: '',
                    nationality: '',
                    passPort: '',
                    ethnicGroup: '',
                    maritalStatus: '',
                    occupationCategoryCode: '',
                    healthInsuranceCardId: '',
                    medicalInsuranceCategoryCode: '',
                    bloodCode: '',
                    rhBloodCode: '',
                    militaryId: '',
                    healthCardId: '',
                    citizenCard: '',
                    hongKongAndMaCaoTravelPermit: '',
                    selfExpenseCard: '',
                    unionPayCard: '',
                    taiWanTravelPermit: '',
                    educationCode: '',
                    healthRecordId: '',
                },
                idList1: {},
                idList2: {},
                checkFlag: {
                    mpiId: false,
                    name: false,
                    idCard: false,
                    sex: false,
                    sexName: false,
                    birthDate: false,
                    patientPhone: false,
                    nationality: false,
                    nationalityName: false,
                    passPort: false,
                    ethnicGroup: false,
                    ethnicGroupName: false,
                    maritalStatus: false,
                    maritalStatusName: false,
                    occupationCategoryCode: false,
                    occupationCategoryName: false,
                    healthInsuranceCardId: false,
                    medicalInsuranceCategoryCode: false,
                    medicalInsuranceCategoryCodeName: false,
                    bloodCode: false,
                    bloodCodeName: false,
                    rhBloodCode: false,
                    rhBloodCodeName: false,
                    militaryId: false,
                    healthCardId: false,
                    citizenCard: false,
                    hongKongAndMaCaoTravelPermit: false,
                    selfExpenseCard: false,
                    unionPayCard: false,
                    taiWanTravelPermit: false,
                    educationCode: false,
                    educationCodeName: false,
                    healthRecordId: false,
                },
                nameList: [
                    'sex', 'nationality', 'ethnicGroup', 'maritalStatus', 'occupationCategoryCode', 'medicalInsuranceCategoryCode', 'bloodCode', 'rhBloodCode', 'educationCode', 
                ],
            };
        },
        methods: {
            mergeForm1Change(event, val) {
                if(event === false) {
                    this.mergeForm1[val] = event;
                    this.mergeForm2[val] = this.mergeFormData2[val];
                    this.resultForm[val] = this.mergeForm2[val];
                    this.resultIdForm[val] = this.idList2[val];
                    if(this.nameList.includes(val)) {
                        this.mergeForm1[val+'Name'] = event;
                        this.mergeForm2[val+'Name'] = this.mergeFormData2[val+'Name'];
                        this.resultForm[val+'Name'] = this.mergeFormData2[val+'Name'];
                    }
                } else {
                    this.mergeForm1[val] = event;
                    this.mergeForm2[val] = false;
                    this.resultForm[val] = this.mergeForm1[val];
                    this.resultIdForm[val] = this.idList1[val];
                    if(this.nameList.includes(val)) {
                        this.mergeForm1[val+'Name'] = event;
                        this.mergeForm2[val+'Name'] = false;
                        this.resultForm[val+'Name'] = this.mergeFormData1[val+'Name'];
                    }
                }
                this.selectForm1All = this.isSelectAll(this.mergeForm1);
                this.selectForm2All = this.isSelectAll(this.mergeForm2);
            },
            mergeForm2Change(event, val) {
                if(event === false) {
                    this.mergeForm2[val] = event;
                    this.mergeForm1[val] = this.mergeFormData1[val];
                    this.resultForm[val] = this.mergeForm1[val];
                    this.resultIdForm[val] = this.idList1[val];
                    if(this.nameList.includes(val)) {
                        this.mergeForm2[val+'Name'] = event;
                        this.mergeForm1[val+'Name'] = this.mergeFormData1[val+'Name'];
                        this.resultForm[val+'Name'] = this.mergeFormData1[val+'Name'];
                    }
                } else {
                    this.mergeForm2[val] = event;
                    this.mergeForm1[val] = false;
                    this.resultForm[val] = this.mergeForm2[val];
                    this.resultIdForm[val] = this.idList2[val];
                    if(this.nameList.includes(val)) {
                        this.mergeForm2[val+'Name'] = event;
                        this.mergeForm1[val+'Name'] = false;
                        this.resultForm[val+'Name'] = this.mergeFormData2[val+'Name'];
                    }
                }
                this.selectForm1All = this.isSelectAll(this.mergeForm1);
                this.selectForm2All = this.isSelectAll(this.mergeForm2);
            },
            selectAllChange(event, val) {
                if(val === 'mergeForm1' && event) {
                    Object.assign(this.mergeForm1, this.mergeFormData1)
                    Object.assign(this.mergeForm2, this.checkFlag)
                    Object.assign(this.resultForm, this.mergeForm1)
                    for(let k in this.resultIdForm) {
                        this.resultIdForm[k] = this.idList1[k];
                    }
                    this.selectForm2All = false;
                } else if(val === 'mergeForm1' && !event) {
                    Object.assign(this.mergeForm1, this.checkFlag)
                    Object.assign(this.mergeForm2, this.mergeFormData2)
                    Object.assign(this.resultForm, this.mergeForm2)
                    for(let k in this.resultIdForm) {
                        this.resultIdForm[k] = this.idList2[k];
                    }
                    this.selectForm2All = true;
                } else if(val === 'mergeForm2' && event) {
                    Object.assign(this.mergeForm2, this.mergeFormData2)
                    Object.assign(this.mergeForm1, this.checkFlag)
                    Object.assign(this.resultForm, this.mergeForm2)
                    for(let k in this.resultIdForm) {
                        this.resultIdForm[k] = this.idList2[k];
                    }
                    this.selectForm1All = false;
                } else if(val === 'mergeForm2' && !event) {
                    Object.assign(this.mergeForm2, this.checkFlag)
                    Object.assign(this.mergeForm1, this.mergeFormData1)
                    Object.assign(this.resultForm, this.mergeForm1)
                    for(let k in this.resultIdForm) {
                        this.resultIdForm[k] = this.idList1[1];
                    }
                    this.selectForm1All = true;
                }
            },
            // 判断对象的每一项是否为false
            isSelectAll(obj) {
                let length = 0
                for(let k in obj) {
                    if(obj[k] !== false) {
                        length++;
                    }
                }
                if(length === Object.keys(obj).length) {
                    return true;
                } else {
                    return false;
                }
            },
            getMianIndexDetail(object) {
                let me = this;
                let mpiId = object.mpiId;
                let params = {
                    mpiId,
                }
                return new Promise((resolve, reject) => {
                    $ajax({
                        url: 'api/mpiview.mpiManageRpcService/selectOnePatientInfo',
                        jsonData: [params]
                    }).then(function (res) {
                        if (res && res.code == 200) {
                            resolve(res.body)
                        }
                    }).fail(function (e) {
                        console.error(e);
                    })
                })
            },
            mergeSelect() {
                let sourceMpiId = this.mergeForm1.mpiId ? this.mergeFormData2.mpiId : this.mergeFormData1.mpiId
                this.resultForm.sourcePatientIdJson = JSON.stringify(this.resultIdForm);
                console.log(this.resultIdForm)
                this.$emit('submitMerge', this.resultForm, sourceMpiId)
            }
        },
        mounted() {
            if(this.mpiIds.length) {
                Promise.all([this.getMianIndexDetail(this.mpiIds[0]), this.getMianIndexDetail(this.mpiIds[1])]).then(res => {
                   if(res && res.length === 2) {
                      Object.assign(this.mergeFormData1, res[0]);
                      Object.assign(this.mergeFormData2, res[1]);
                      this.idList1 = JSON.parse(res[0].sourcePatientIdJson);
                      this.idList2 = JSON.parse(res[1].sourcePatientIdJson);
                      console.log(this.idList1, this.idList2)
                      Object.assign(this.mergeForm1, this.mergeFormData1)
                      Object.assign(this.resultForm, this.mergeFormData1)
                      Object.assign(this.mergeForm2, this.checkFlag)
                      for(let k in this.resultIdForm) {
                        this.resultIdForm[k] = this.idList1[k];
                    }
                   } 
                })
            }
        }
    })
})