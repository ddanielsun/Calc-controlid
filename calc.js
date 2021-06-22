var calculadora = new Vue({
  el: "#calc",

  data: {
    teste: true,
    calc: {
      diasFer: "",
      diasAbon: "",
      adiantamento13: 0,
      numDep: 0,
      salBase: "",
      remVal: 0,
    },
    proventos: {},
    error: [],
    descontos: {},
    flagCalculo: false,
    flagVal: false,
  },

  methods: {
    calculaRescisao: function (e) {
      e.preventDefault();

      this.flagCalculo = false;

      this.removeMask();
      this.removeTableMask();
      if (this.verificaCampos()) {
        return;
      }

      var self = this;

      this.proventos = {
        saldoFer: this.calcSalFer(),
        adc1_3Fer: this.calcFer1_3(),
        abonoPec: this.calcAbonPecu(),
        abonoPec1_3: this.calcAbonoPecu1_3(),
        parc1_3: this.calcAdian1_3Sal(),
        INSS: this.calcDescINSS(),
        IRRF: this.calcDescIRFF(),
        total: this.calcTotal(),
      };

      setTimeout(function () {
        self.flagCalculo = true;
      }, 900);
      setTimeout(function () {
        self.tableMask();
      }, 1000);
    },

    removeMask: function () {
      var removeMaskSal = jQuery("#salBase").cleanVal() / 100;
      this.calc.salBase = removeMaskSal;

      var removeMaskSal = jQuery("#remVal").cleanVal() / 100;
      this.calc.remVal = removeMaskSal;
    },

    tableMask: function () {
      jQuery(".money").mask("000.000.000.000,00", {
        reverse: true,
      });
    },

    removeTableMask: function () {
      jQuery(".money").unmask("000.000.000.000,00", {
        reverse: true,
      });
    },

    limpaRescisao: function (e) {
      e.preventDefault();
      jQuery("#salBase").val("");
      jQuery("#remVal").val("");
      this.flagCalculo = false;

      this.fillForm();
      this.limpaVal();
    },

    calcTotal: function () {
      const total =
        parseFloat(this.calcSalFer()) +
        parseFloat(this.calcFer1_3()) +
        parseFloat(this.calcAbonPecu()) +
        parseFloat(this.calcAbonoPecu1_3()) +
        parseFloat(this.calcAdian1_3Sal()) -
        parseFloat(this.calcDescINSS()) -
        parseFloat(this.calcDescIRFF());
      return total.toFixed(2);
    },

    calcSalFer: function () {
      const caclSalFer =
        ((parseFloat(this.calc.salBase) + parseFloat(this.calc.remVal)) / 30) *
        parseFloat(this.calc.diasFer);
      return caclSalFer.toFixed(2);
    },

    calcFer1_3: function () {
      const calcFer1_3 = this.calcSalFer() / 3;
      return calcFer1_3.toFixed(2);
    },

    calcAbonPecu: function () {
      const calcAbonPecu =
        ((parseFloat(this.calc.salBase) + parseFloat(this.calc.remVal)) / 30) *
        parseInt(this.calc.diasAbon);
      return calcAbonPecu.toFixed(2);
    },

    calcAbonoPecu1_3: function () {
      const calcAbonoPecu1_3 = this.calcAbonPecu() / 3;
      return calcAbonoPecu1_3.toFixed(2);
    },

    calcAdian1_3Sal: function () {
      if (this.calc.adiantamento13) {
        const calcAdian1_3Sal = parseFloat(this.calc.salBase) / 2;
        return calcAdian1_3Sal.toFixed(2);
      } else {
        return 0;
      }
    },

    // //CALCULA DIAS DE AVISO PREVIO INDENIZADO
    // calcDiasAvsPrev: function () {
    //   if (this.calc.avsPrev == "1") {
    //     var dias = 30;
    //     var dataRec = moment(this.calc.dataRec);
    //     var dataAdm = moment(this.calc.dataAdm);
    //     var dif = parseInt(dataRec.diff(dataAdm, "years") * 3);

    //     if (dif > 60) {
    //       dias += 90;
    //     } else {
    //       dias += dif;
    //     }
    //     return dias;
    //   } else {
    //     return 0;
    //   }
    // },

    // //CALCULA DATA INICIO ULTIMO PERIODO AQUISITIVO DE FERIAS
    // calcDataUltPerFer: function () {
    //   var dataAdm = moment(this.calc.dataAdm);
    //   var dataRec = moment(this.calc.dataRec);
    //   var data = moment(
    //     `${dataRec.format("YYYY")}-${dataAdm.format("MM")}-${dataAdm.format(
    //       "DD"
    //     )}`
    //   );

    //   if (data > dataRec) {
    //     var year = parseInt(dataRec.format("YYYY")) - 1;
    //     return moment(
    //       `${year}-${dataAdm.format("MM")}-${dataAdm.format("DD")}`
    //     ).format("YYYY-MM-DD");
    //   } else {
    //     var year = parseInt(dataRec.format("YYYY"));
    //     return moment(
    //       `${year}-${dataAdm.format("MM")}-${dataAdm.format("DD")}`
    //     ).format("YYYY-MM-DD");
    //   }
    // },

    // //Calcula Saldo do salario
    // calculaSal: function () {
    //   var sal =
    //     (this.calc.ultSal / 30) *
    //     parseInt(moment(this.calc.dataRec).format("DD"));
    //   return sal.toFixed(2);
    // },

    // calcSalFamili: function () {
    //   var calAvs = this.calculaAvsPrev() == "-" ? 0 : this.calculaAvsPrev();
    //   if (this.calculaSal() + calAvs < 1425.56) {
    //     var salFam = this.calc.filhosMen14 * 48.62;
    //     if (parseInt(salFam) == 0) {
    //       return "-";
    //     } else {
    //       return salFam.toFixed(2);
    //     }
    //   } else {
    //     return "-";
    //   }
    // },

    // //calcula valor do aviso previo
    // calculaAvsPrev: function () {
    //   if (this.calc.motResc == "semJustaCausa" && this.calc.avsPrev == "1") {
    //     var avsPrev = (this.calc.ultSal / 30) * this.calcDiasAvsPrev();
    //     return avsPrev.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    // //calcula 13 salario proporcional
    // calc13Prop: function () {
    //   if (this.calc.motResc != "comJustaCausa") {
    //     var dataAdms = moment(this.calc.dataAdm);
    //     var dataRec = moment(this.calc.dataRec);
    //     var salProp = this.calc.ultSal / 12;
    //     var meses = 0;
    //     if (
    //       parseInt(dataAdms.format("YYYY")) == parseInt(dataRec.format("YYYY"))
    //     ) {
    //       meses +=
    //         parseInt(dataRec.format("MM")) -
    //         parseInt(dataAdms.format("MM")) -
    //         1;
    //       meses += parseInt(dataAdms.format("DD")) <= 15 ? 1 : 0;
    //       meses += parseInt(dataRec.format("DD")) >= 15 ? 1 : 0;
    //     } else {
    //       meses += parseInt(dataRec.format("DD")) >= 15 ? 1 : 0;
    //       meses += parseInt(dataRec.format("MM")) - 1;
    //     }
    //     var result = meses * salProp;

    //     return result.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula 13 salario indenizado
    // calc13Indeni: function () {
    //   if (this.calc.motResc == "semJustaCausa" && this.calc.avsPrev == "1") {
    //     var dataAdms = moment(this.calc.dataAdm);
    //     var dataRec = moment(this.calcDataProje());
    //     var dataRec1 = moment(this.calc.dataRec);
    //     var salProp = this.calc.ultSal / 12;
    //     var meses = 0;
    //     if (
    //       parseInt(dataAdms.format("YYYY")) == parseInt(dataRec.format("YYYY"))
    //     ) {
    //       meses +=
    //         parseInt(dataRec.format("MM")) -
    //         parseInt(dataAdms.format("MM")) -
    //         1;
    //       meses += parseInt(dataAdms.format("DD")) <= 15 ? 1 : 0;
    //       meses += parseInt(dataRec.format("DD")) >= 15 ? 1 : 0;
    //     } else {
    //       var dataB = moment(`${dataRec1.format("YYYY")}-01-01`);
    //       var meses = dataRec.diff(dataB, "months");
    //       meses += parseInt(dataRec.format("DD")) >= 15 ? 1 : 0;
    //     }
    //     var result = parseFloat(meses * salProp - this.calc13Prop()).toFixed(2);
    //     return Math.trunc(result) == 0 ? "-" : result;
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula ferias vencidas
    // calcFerVcd: function () {
    //   if (this.calc.ferVcd == "true") {
    //     if (this.calc.diasFerVenc == "") {
    //       var ferVcd = parseFloat(this.calc.ultSal);
    //       return ferVcd.toFixed(2);
    //     } else {
    //       var ferVcd = parseFloat(
    //         this.calc.ultSal * (this.calc.diasFerVenc / 30)
    //       );
    //       return ferVcd.toFixed(2);
    //     }
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula 1/3 das ferias
    // calcFerVcd1_3: function () {
    //   if (this.calc.ferVcd == "true") {
    //     var result = this.calcFerVcd() / 3;
    //     return result.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula rescisão antecipada por parte do empregador
    // calcRescAntecip: function () {
    //   if (this.calc.motResc == "rescAntEmpre") {
    //     var dataRec = moment(this.calc.dataRec);
    //     var dataPrev = moment(this.calc.dataPrev);
    //     var datadif = dataPrev.diff(dataRec, "months");
    //     var sumMonths = datadif * 30;

    //     if (
    //       moment(this.calc.dataPrev).format("DD") >
    //       moment(this.calc.dataRec).format("DD")
    //     ) {
    //       sumMonths +=
    //         parseInt(moment(this.calc.dataPrev).format("DD")) -
    //         parseInt(moment(this.calc.dataRec).format("DD"));
    //     } else if (
    //       moment(this.calc.dataPrev).format("DD") <
    //       moment(this.calc.dataRec).format("DD")
    //     ) {
    //       sumMonths +=
    //         30 -
    //         parseInt(moment(this.calc.dataRec).format("DD")) +
    //         parseInt(moment(this.calc.dataPrev).format("DD"));
    //     } else {
    //       sumMonths += 0;
    //     }
    //     var salProp = this.calc.ultSal / 60;
    //     var result = sumMonths * salProp;
    //     return result.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula ferias proporcionais
    // calcferPropor: function () {
    //   if (this.calc.motResc != "comJustaCausa") {
    //     var dataAdm = moment(this.calc.dataAdm);
    //     var dataRec = moment(this.calc.dataRec);
    //     var x = this.calcDataUltPerFer();
    //     var dataUltPer = moment(x);
    //     var result = dataRec.diff(dataUltPer, "months");
    //     var ultSal = this.calc.ultSal / 12;
    //     var addMonth = 0;

    //     if (
    //       parseInt(dataRec.format("DD")) > parseInt(dataUltPer.format("DD"))
    //     ) {
    //       addMonth +=
    //         parseInt(dataRec.format("DD")) - parseInt(dataUltPer.format("DD"));
    //     } else if (
    //       parseInt(dataRec.format("DD")) < parseInt(dataUltPer.format("DD"))
    //     ) {
    //       addMonth +=
    //         30 -
    //         parseInt(dataUltPer.format("DD")) +
    //         parseInt(dataRec.format("DD"));
    //     } else {
    //       addMonth += 0;
    //     }

    //     if (addMonth >= 15) {
    //       result += 1;
    //       var resu = parseFloat(result * ultSal).toFixed(2);
    //       return resu == 0 || resu == isNaN() ? "-" : resu;
    //     } else {
    //       var resu = parseFloat(result * ultSal).toFixed(2);
    //       return resu == 0 || resu == isNaN() ? "-" : resu;
    //     }
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula 1/3 das ferias proporcionais
    // calcFerPropor1_3: function () {
    //   if (this.calcferPropor() != "-") {
    //     var result = (this.calcferPropor() / 3).toFixed(2);
    //     return Math.trunc(result) == 0 ? "-" : result;
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula ferias indenizadas
    // calcFerIndeni: function () {
    //   if (this.calc.motResc == "semJustaCausa" && this.calc.avsPrev == "1") {
    //     var dataRec = moment(this.calc.dataRec);
    //     var dataProje = moment(this.calcDataProje());
    //     var dataFerPerio = moment(this.calcDataUltPerFer());
    //     var meses = dataProje.diff(dataRec, "months");
    //     var ultSal = this.calc.ultSal / 12;
    //     var res =
    //       Math.abs(30 - parseInt(dataProje.format("DD"))) +
    //       Math.abs(30 - parseInt(dataProje.format("DD")));
    //     meses += res > 15 ? 1 : 0;

    //     var result = ultSal * meses;
    //     return result.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula 1/3 das ferias indenizadas
    // calcFerIndeni1_3: function () {
    //   if (this.calcFerIndeni() != "-") {
    //     var ferIndeni1_3 = this.calcFerIndeni() / 3;
    //     return ferIndeni1_3.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    //calcula desconto do INSS
    calcDescINSS: function () {
      var sal = parseFloat(this.calcSalFer()) + parseFloat(this.calcFer1_3());
      var resultado = 0;
      if (sal >= 1100.0) {
        resultado += 82.5;
        sal -= 1100.0;
        if (sal >= 1103.48) {
          resultado += 99.31;
          sal -= 1103.48;
          if (sal >= 1101.74) {
            resultado += 132.21;
            sal -= 1101.74;
            if (sal >= 3128.35) {
              resultado += 437.97;
              sal -= 3128.35;
            } else {
              resultado += sal * 0.14;
            }
          } else {
            resultado += sal * 0.12;
          }
        } else {
          resultado += sal * 0.09;
        }
      } else {
        resultado += sal * 0.075;
      }
      return resultado != "" ? resultado.toFixed(2) : "-";
    },

    //calcula desconto do IRFF
    calcDescIRFF: function () {
      var money = parseFloat(this.calcSalFer()) + parseFloat(this.calcFer1_3());
      var moneyDep = parseFloat(this.calc.numDep) * 189.59;
      if (moneyDep > money) {
        return 0;
      } else {
        var sal = money - moneyDep - parseFloat(this.calcDescINSS());
        var salDesc = sal;
        var resultado = 0;
        if (sal >= 1903.98) {
          resultado += 0;
          sal -= 1903.98;
          if (sal >= 922.67) {
            resultado += 69.2;
            sal -= 922.67;
            if (sal >= 924.4) {
              resultado += 138.66;
              sal -= 924.4;
              if (sal >= 913.63) {
                resultado += 205.57;
                sal -= 913.63;
                if (sal >= 4622.22) {
                  resultado += sal * 0.275;
                } else {
                  resultado += sal * 0.275;
                }
              } else {
                resultado += sal * 0.225;
              }
            } else {
              resultado += sal * 0.15;
            }
          } else {
            resultado += sal * 0.075;
          }
        } else {
          resultado += sal * 0;
        }
        return resultado.toFixed(2);
      }
    },

    // //calcula inss do 13
    // calcDescINSS13: function () {
    //   var sal = this.calc13Prop();
    //   if (sal != "-") {
    //     var resultado = 0;

    //     if (sal >= 1045.0) {
    //       resultado += 78.38;
    //       sal -= 1045.0;
    //       if (sal >= 1044.6) {
    //         resultado += 94.01;
    //         sal -= 1044.6;
    //         if (sal >= 1044.8) {
    //           resultado += 125.38;
    //           sal -= 1044.8;
    //           if (sal >= 2966.66) {
    //             resultado += 415.33;
    //             sal -= 1044.8;
    //           } else {
    //             resultado += sal * 0.14;
    //           }
    //         } else {
    //           resultado += sal * 0.12;
    //         }
    //       } else {
    //         resultado += sal * 0.09;
    //       }
    //     } else {
    //       resultado += sal * 0.075;
    //     }
    //     return resultado != "" ? resultado.toFixed(2) : "-";
    //   } else {
    //     return "-";
    //   }
    // },

    // //calcula irff do 13
    // calcDescIRFF13: function () {
    //   var sal =
    //     parseFloat(this.calc13Prop()) +
    //     parseFloat(this.calc13Indeni() == "-" ? 0 : this.calc13Indeni()) -
    //     parseFloat(this.calcDescINSS13());
    //   var salDesc = sal;
    //   var resultado = 0;
    //   if (sal != "-" && !isNaN(sal)) {
    //     if (sal >= 1903.98) {
    //       resultado += 0;
    //       sal -= 1903.98;
    //       if (sal >= 922.67) {
    //         resultado += 69.2;
    //         sal -= 922.67;
    //         if (sal >= 924.4) {
    //           resultado += 138.66;
    //           sal -= 924.4;
    //           if (sal >= 913.63) {
    //             resultado += 205.57;
    //             sal -= 913.63;
    //             if (sal >= 4622.22) {
    //               resultado += sal * 0.275;
    //             } else {
    //               resultado += sal * 0.275;
    //             }
    //           } else {
    //             resultado += sal * 0.225;
    //           }
    //         } else {
    //           resultado += sal * 0.15;
    //         }
    //       } else {
    //         resultado += sal * 0.075;
    //       }
    //     } else {
    //       resultado += sal * 0;
    //     }
    //     return resultado != "" && resultado != 0 ? resultado.toFixed(2) : "-";
    //   } else {
    //     return "-";
    //   }
    // },

    // //arrumar
    // calcDescAvsPrev: function () {
    //   if (this.calc.motResc == "pediDemiss") {
    //     return parseFloat(this.calc.ultSal).toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    // calcDescRescAntecip: function () {
    //   if (this.calc.motResc == "rescAntFunc") {
    //     var dataRec = moment(this.calc.dataRec);
    //     var dataPrev = moment(this.calc.dataPrev);
    //     var datadif = dataPrev.diff(dataRec, "months");
    //     var sumMonths = datadif * 30;

    //     if (
    //       moment(this.calc.dataPrev).format("DD") >
    //       moment(this.calc.dataRec).format("DD")
    //     ) {
    //       sumMonths +=
    //         parseInt(moment(this.calc.dataPrev).format("DD")) -
    //         parseInt(moment(this.calc.dataRec).format("DD"));
    //     } else if (
    //       moment(this.calc.dataPrev).format("DD") <
    //       moment(this.calc.dataRec).format("DD")
    //     ) {
    //       sumMonths +=
    //         30 -
    //         parseInt(moment(this.calc.dataRec).format("DD")) +
    //         parseInt(moment(this.calc.dataPrev).format("DD"));
    //     } else {
    //       sumMonths += 0;
    //     }
    //     var salProp = this.calc.ultSal / 60;
    //     var result = sumMonths * salProp;
    //     return result.toFixed(2);
    //   } else {
    //     return "-";
    //   }
    // },

    fillForm: function () {
      this.calc = {
        diasFer: "",
        diasAbon: "",
        adiantamento13: 0,
        numDep: 0,
        salBase: "",
        remVal: 0,
      };
    },

    limpaVal: function () {
      jQuery("#salBase").attr({ style: "border:1px solid #ced4da" });
      jQuery("#appendUltSal").remove();

      jQuery("#remVal").attr({ style: "border:1px solid #ced4da" });
      jQuery("#appendDataAdm").remove();

      jQuery("#numDep").attr({ style: "border:1px solid #ced4da" });
      jQuery("#appendDataRec").remove();
      jQuery("#appendDataRecM").remove();

      jQuery("#diasAbon").attr({ style: "border:1px solid #ced4da" });
      jQuery("#appendMotRec").remove();

      jQuery("#diasFer").attr({ style: "border:1px solid #ced4da" });
      jQuery("#appendDataFinal").remove();
    },

    verificaCampos: function () {
      this.error = [];
      if (this.calc.diasFer == "") {
        jQuery("#appendUltSal").remove();
        jQuery("#diasFer")
          .attr({ style: "border:1px solid red!important" })
          .parent()
          .parent()
          .append(
            '<span id="appendUltSal" style="color:red;font-size:11px">Campo Obrigatorio</span>'
          );
        this.error.push("Valor do ultimo salário obrigatorio");
      } else {
        jQuery("#diasFer").attr({ style: "border:1px solid #ced4da" });
        jQuery("#appendUltSal").remove();
      }
      if (this.calc.diasAbon == "") {
        jQuery("#appendDataAdm").remove();
        jQuery("#diasAbon")
          .attr({ style: "border:1px solid red!important" })
          .parent()
          .parent()
          .append(
            '<span id="appendDataAdm" style="color:red;font-size:11px">Campo Obrigatorio</span>'
          );
        this.error.push("Data de adm obrigatoria");
      } else {
        jQuery("#diasAbon").attr({ style: "border:1px solid #ced4da" });
        jQuery("#appendDataAdm").remove();
      }
      if (this.calc.numDep === "") {
        this.error.push("Data de Rec obrigatoria");
        jQuery("#appendDataRec").remove();
        jQuery("#numDep")
          .attr({ style: "border:1px solid red" })
          .parent()
          .parent()
          .append(
            '<span id="appendDataRec" style="color:red;font-size:11px">Campo Obrigatorio</span>'
          );
      } else {
        jQuery("#numDep").attr({ style: "border:1px solid #ced4da" });
        jQuery("#appendDataRec").remove();
      }
      if (this.calc.salBase == "") {
        jQuery("#appendMotRec").remove();
        jQuery("#salBase")
          .attr({ style: "border:1px solid red!important" })
          .parent()
          .parent()
          .append(
            '<span id="appendMotRec" style="color:red;font-size:11px">Campo Obrigatorio</span>'
          );
      } else {
        this.flagVal = false;
        jQuery("#salBase").attr({ style: "border:1px solid #ced4da" });
        jQuery("#appendMotRec").remove();
      }

      // if (this.calc.remVal === "") {
      //   console.log(this.calc.remVal);
      //   // jQuery("#appendMotRec").remove();
      //   jQuery("#remVal")
      //     .attr({ style: "border:1px solid red!important" })
      //     .parent()
      //     .parent()
      //     .append(
      //       '<span id="appendMotRec" style="color:red;font-size:11px">Campo Obrigatorio</span>'
      //     );
      //   this.error.push("Motivo da rescisão obrigatoria");
      // } else {
      //   this.flagVal = false;
      //   jQuery("#remVal").attr({ style: "border:1px solid #ced4da" });
      //   // jQuery("#appendMotRec").remove();
      // }

      return this.error.length > 0;
    },
  },

  filters: {
    moneyMask: function (value) {
      value.mask("###.###.###.###,00", {
        reverse: true,
      });
      return value;
    },
  },

  mounted: function () {
    jQuery("#salBase").mask("###.###.###.###,00", {
      reverse: true,
    });

    jQuery("#remVal").mask("###.###.###.###,00", {
      reverse: true,
    });
  },
});
