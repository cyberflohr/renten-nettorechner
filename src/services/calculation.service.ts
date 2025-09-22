import type { UserInput, CalculationResult } from '@/types';

export class CalculationService {
  /**
   * Führt die Rentenberechnung basierend auf den Benutzereingaben durch.
   * Diese Funktion enthält die reine, UI-unabhängige Geschäftslogik.
   * @param input - Die vom Benutzer bereitgestellten Daten.
   * @returns Ein Promise, das ein Array von Berechnungsergebnissen auflöst.
   */
  public async calculate(input: UserInput): Promise<CalculationResult[]> {
    console.log('Starting calculation with input:', input);

    const allResults: CalculationResult[] = []; // Use a temporary array to store all results

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // --- Annahmen für die Berechnung (vereinfacht) ---
    // Diese Werte müssten in einer echten Anwendung aus aktuellen Tabellen kommen.
    const RENTENPUNKTWERT = 37.60; // Wert eines Rentenpunktes in € (Stand 2023 West)
    const ABSCHLAG_PRO_MONAT = 0.003; // 0.3% pro Monat vorzeitiger Rente

  // KdVR-Beitragssätze (gesetzliche Krankenversicherung der Rentner)
  const KdVR_KV_BEITRAGSSATZ = 0.146; // Allgemeiner Beitragssatz KdVR
  const KdVR_ZUSATZBEITRAG = 0.016; // Durchschnittlicher Zusatzbeitrag KdVR
  const KdVR_PV_BEITRAGSSATZ = 0.034; // Pflegeversicherung (kinderlos, ab 23)

    // Vereinfachte Einkommensteuertabelle (monatlich)
    // Dies ist eine stark vereinfachte, illustrative Tabelle. (Unverändert)
    const INCOME_TAX_TABLE = [
      { limit: 909, rate: 0 },    // Grundfreibetrag (monatlich 10908 / 12)
      { limit: 1500, rate: 0.14 }, // 14% für Einkommen bis 1500
      { limit: 2500, rate: 0.24 }, // 24% für Einkommen bis 2500
      { limit: 999999, rate: 0.42 }, // 42% für Einkommen darüber
    ];

    // Besteuerungsanteil der Rente nach Rentenbeginnjahr (vereinfacht)
    // Quelle: https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Rentenarten-und-Leistungen/Rentenbesteuerung/Rentenbesteuerung_node.html
    const BESTEUERUNGSANTEIL_RENTE_TABLE = [
      { year: 2005, percentage: 0.50 },
      { year: 2006, percentage: 0.52 },
      { year: 2007, percentage: 0.54 },
      { year: 2008, percentage: 0.56 },
      { year: 2009, percentage: 0.58 },
      { year: 2010, percentage: 0.60 },
      { year: 2011, percentage: 0.62 },
      { year: 2012, percentage: 0.64 },
      { year: 2013, percentage: 0.66 },
      { year: 2014, percentage: 0.68 },
      { year: 2015, percentage: 0.70 },
      { year: 2016, percentage: 0.72 },
      { year: 2017, percentage: 0.74 },
      { year: 2018, percentage: 0.76 },
      { year: 2019, percentage: 0.78 },
      { year: 2020, percentage: 0.80 },
      { year: 2021, percentage: 0.81 },
      { year: 2022, percentage: 0.82 },
      { year: 2023, percentage: 0.83 },
      { year: 2024, percentage: 0.84 },
      { year: 2025, percentage: 0.85 },
      { year: 2026, percentage: 0.86 },
      { year: 2027, percentage: 0.87 },
      { year: 2028, percentage: 0.88 },
      { year: 2029, percentage: 0.89 },
      { year: 2030, percentage: 0.90 },
      { year: 2031, percentage: 0.91 },
      { year: 2032, percentage: 0.92 },
      { year: 2033, percentage: 0.93 },
      { year: 2034, percentage: 0.94 },
      { year: 2035, percentage: 0.95 },
      { year: 2036, percentage: 0.96 },
      { year: 2037, percentage: 0.97 },
      { year: 2038, percentage: 0.98 },
      { year: 2039, percentage: 0.99 },
      { year: 2040, percentage: 1.00 },
    ];

    // Kirchensteuersätze pro Bundesland (vereinfacht)
    const KIRCHENSTEUER_SATZ_PRO_BUNDESLAND: { [key: string]: number } = {
      'Baden-Württemberg': 0.08, // 8%
      'Bayern': 0.08, // 8%
      'Berlin': 0.09, // 9%
      'Brandenburg': 0.09, // 9%
      'Bremen': 0.09, // 9%
      'Hamburg': 0.09, // 9%
      'Hessen': 0.09, // 9%
      'Mecklenburg-Vorpommern': 0.09, // 9%
      'Niedersachsen': 0.09, // 9%
      'Nordrhein-Westfalen': 0.09, // 9%
      'Rheinland-Pfalz': 0.09, // 9%
      'Saarland': 0.09, // 9%
      'Sachsen': 0.09, // 9%
      'Sachsen-Anhalt': 0.09, // 9%
      'Schleswig-Holstein': 0.09, // 9%
      'Thüringen': 0.09, // 9%
    }; // 8% in BY/BW, 9% sonst

    // 1. Regelaltersgrenze berechnen (vereinfacht)
    // Für Geburtsjahrgänge ab 1964 ist die Regelaltersgrenze 67 Jahre.
    const birthYear = new Date(input.birthday).getFullYear();
    let regularRetirementAge = 67;
    // Hier könnte man komplexere Logik für frühere Jahrgänge einfügen

    const today = new Date();
  const currentYear = today.getFullYear();

  // Rentenbeginnjahr korrekt berechnen: Geburtsjahr + Regelaltersgrenze
  let retirementStartYear = birthYear + regularRetirementAge;

    let besteuerungsanteil = 0;
    for (const entry of BESTEUERUNGSANTEIL_RENTE_TABLE) {
      if (retirementStartYear >= entry.year) {
        besteuerungsanteil = entry.percentage;
      } else {
        break;
      }
    }

    // Monatliche Bruttorente (vereinfacht: Summe der Rentenanwartschaften)
    // In einer echten Berechnung wäre dies komplexer (Rentenpunkte, Zugangsfaktor etc.)
    const baseGrossPension = input.expectedPension; // Annahme: Dies ist die Bruttorente bei Regelaltersgrenze

    // Szenarien für vorzeitigen Rentenbezug (0, 6, 12, 18, 24 Monate)
  // Szenarien für vorzeitigen Rentenbezug (0, 6, 12, 18, 24, 30, 36, 42, 48 Monate)
  const monthsEarlyScenarios = [0, 6, 12, 18, 24, 30, 36, 42, 48];

  let netStandard: number | null = null;
  for (const monthsEarly of monthsEarlyScenarios) {

      const birthDate = new Date(input.birthday);
      const sixtySeventhBirthday = new Date(
        birthDate.getFullYear() + regularRetirementAge,
        birthDate.getMonth(),
        birthDate.getDate()
      );
      const regularRetirementDate = new Date(
        sixtySeventhBirthday.getFullYear(),
        sixtySeventhBirthday.getMonth() + 1,
        1
      );
      const retirementDate = new Date(regularRetirementDate.getTime());
      retirementDate.setMonth(retirementDate.getMonth() - monthsEarly);
      const formattedRetirementDate = formatDate(retirementDate);

      let grossPension = baseGrossPension;
      let deductionEarlyRetirement = 0;

      // Individuelles Rentenbeginnjahr für diese Variante berechnen
      // monthsEarly ist in Monaten, also: (Geburtsjahr + Regelaltersgrenze) - (monthsEarly / 12)
      let individualRetirementYear = birthYear + regularRetirementAge - Math.floor(monthsEarly / 12);
      // Wenn z.B. 6 Monate früher, dann -0,5 Jahr, also auf das Vorjahr runden
      if ((monthsEarly % 12) !== 0) {
        individualRetirementYear = birthYear + regularRetirementAge - Math.floor(monthsEarly / 12);
      }

      // Passenden Besteuerungsanteil für diese Variante ermitteln
      let individualBesteuerungsanteil = 0;
      for (const entry of BESTEUERUNGSANTEIL_RENTE_TABLE) {
        if (individualRetirementYear >= entry.year) {
          individualBesteuerungsanteil = entry.percentage;
        } else {
          break;
        }
      }

      // Abschlag berechnen, wenn vorzeitiger Bezug
      if (monthsEarly > 0) {
        deductionEarlyRetirement = grossPension * (ABSCHLAG_PRO_MONAT * monthsEarly);
        grossPension -= deductionEarlyRetirement;
        const statementDate = new Date(input.statementDate);
        const monthsToRetirement = Math.max(1, (regularRetirementDate.getFullYear() - statementDate.getFullYear()) * 12 + (regularRetirementDate.getMonth() - statementDate.getMonth()));
        const totalExpectedRentenpunkte = input.expectedPension / RENTENPUNKTWERT;
        // Anwartschaft als Eurobetrag eingeben, intern in Rentenpunkte umrechnen
        const currentRentenpunkte = input.currentPensionEntitlement / RENTENPUNKTWERT;
        const futureRentenpunkte = Math.max(0, totalExpectedRentenpunkte - currentRentenpunkte);
        const avgMonthlyRentenpunkte = monthsToRetirement > 0 ? futureRentenpunkte / monthsToRetirement : 0;
        const lostRentenpunkte = avgMonthlyRentenpunkte * monthsEarly;
        const lostRente = lostRentenpunkte * RENTENPUNKTWERT;
        grossPension -= lostRente;
      }


  // Nur KdVR relevant: Rentner zahlen vollen Beitragssatz auf gesetzliche Rente
  // https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Krankenversicherung-der-Rentner/krankenversicherung-der-rentner_node.html
  // Annahme: Nur gesetzliche Rente wird verbeitragt, keine Nebeneinkünfte
  const fullKVRate = KdVR_KV_BEITRAGSSATZ + KdVR_ZUSATZBEITRAG;
  // Rentner zahlt nur die Hälfte, die andere Hälfte zahlt die Rentenkasse
  const kvContribution = grossPension * (fullKVRate / 2);
  const pvContribution = grossPension * KdVR_PV_BEITRAGSSATZ;


  // Besteuerungsanteil: Nur dieser Teil der Rente ist steuerpflichtig (individuell)
  let taxablePension = grossPension * individualBesteuerungsanteil;

      // Steuerberechnung nach §32a EStG 2025
      const zvE = Math.max(0, taxablePension * 12);
      let tax = 0;
      if (zvE <= 12096) {
        tax = 0;
      } else if (zvE <= 17443) {
        // 1. Progressionszone
        const y = (zvE - 12096) / 10000;
        tax = (932.3 * y + 1400) * y;
      } else if (zvE <= 68480) {
        // 2. Progressionszone
        const z = (zvE - 17443) / 10000;
        tax = (176.64 * z + 2397) * z + 1015.13;
      } else if (zvE <= 277825) {
        // Proportionalzone
        tax = 0.42 * zvE - 10911.92;
      } else {
        // Reichensteuer
        tax = 0.45 * zvE - 19246.67;
      }
      // Steuer wieder auf Monat umrechnen
      tax = Math.max(0, tax / 12);

  // Netto: Bruttorente minus KV, PV, Steuer
  const netPension = grossPension - kvContribution - pvContribution - tax;

      // Amortisationszeit: Wie lange dauert es, bis sich der frühere Renteneintritt "auszahlt"?
      // Berechnung: Differenz der Netto-Rente zum Standard-Szenario, geteilt durch monatlichen Verlust, ergibt Monate bis "Break-Even"
      let breakEvenMonths = 0;
      if (monthsEarly === 0) {
        // Set netStandard to the netPension value for 0 months early
        netStandard = netPension;
      }
      if (monthsEarly > 0 && netStandard !== null) {
        const monthlyLoss = netStandard - netPension;
        console.log('DEBUG: netPension:', netPension);
        console.log('DEBUG: netStandard:', netStandard);
        console.log('DEBUG: monthsEarly:', monthsEarly);
        console.log('DEBUG: monthlyLoss:', monthlyLoss);
        const minLossThreshold = 1; // Minimum monthly loss for meaningful amortisation
        if (Math.abs(monthlyLoss) > minLossThreshold) {
          breakEvenMonths = (netPension * monthsEarly) / Math.abs(monthlyLoss);
          console.log('DEBUG: breakEvenMonths:', breakEvenMonths);
        } else {
          breakEvenMonths = Infinity;
        }
      }
  // Für Standard-Szenario: 0 Monate
  const actualRetirementAge = regularRetirementAge - (monthsEarly / 12);
  const breakEvenAge = breakEvenMonths === Infinity ? Infinity : actualRetirementAge + (breakEvenMonths / 12);

      allResults.push({
        retirementDate: formattedRetirementDate,
        monthsEarly,
        grossPension: parseFloat(grossPension.toFixed(2)),
        deductionEarlyRetirement: parseFloat(deductionEarlyRetirement.toFixed(2)),
        pvContribution: parseFloat(pvContribution.toFixed(2)),
        kvContribution: parseFloat(kvContribution.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        netPension: parseFloat(netPension.toFixed(2)),
        breakEvenAge: parseFloat(breakEvenAge.toFixed(1)),
        netDifferenceToStandard: 0, // Placeholder, will be calculated after the loop
        taxableIncome: parseFloat(taxablePension.toFixed(2)),
        taxationPercentage: parseFloat((individualBesteuerungsanteil * 100).toFixed(1)),
      });
    }

    // Calculate netDifferenceToStandard after all scenarios are processed
    const standardNetPension = allResults[0].netPension;
    const finalResults = allResults.map(result => ({
      ...result,
      netDifferenceToStandard: parseFloat((result.netPension - standardNetPension).toFixed(2)),
    }));

    console.log('Calculation finished. Results:', finalResults);
    return finalResults;
  }
}
