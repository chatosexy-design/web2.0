import { OMSAdvisor } from '../services/omsAdvisor';

describe('OMSAdvisor Service', () => {
  test('should return start registration message when no logs provided', () => {
    const recommendations = OMSAdvisor.analyzeDailyIntake([]);
    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].title).toBe('¡Inicia tu registro!');
    expect(recommendations[0].category).toBe('balance');
  });

  test('should detect high fat intake according to WHO guidelines', () => {
    const highFatLogs = [
      { calories: 1000, protein: 20, carbs: 50, fat: 60 } // Fat is 540 kcal (60*9), which is 54% (>30%)
    ];
    const recommendations = OMSAdvisor.analyzeDailyIntake(highFatLogs);
    const fatRec = recommendations.find(r => r.category === 'fat');
    expect(fatRec).toBeDefined();
    expect(fatRec?.priority).toBe('high');
    expect(fatRec?.title).toBe('Consumo Elevado de Grasas');
  });

  test('should detect protein deficit', () => {
    const lowProteinLogs = [
      { calories: 1000, protein: 10, carbs: 150, fat: 20 } // Protein is 40 kcal (10*4), which is 4% (<10%)
    ];
    const recommendations = OMSAdvisor.analyzeDailyIntake(lowProteinLogs);
    const proteinRec = recommendations.find(r => r.category === 'protein');
    expect(proteinRec).toBeDefined();
    expect(proteinRec?.priority).toBe('medium');
  });

  test('should congratulate for excellent calorie goal', () => {
    const healthyLogs = [
      { calories: 1800, protein: 60, carbs: 250, fat: 40 } // Balanced kcal (1800 is 90% of 2000)
    ];
    const recommendations = OMSAdvisor.analyzeDailyIntake(healthyLogs);
    const calorieRec = recommendations.find(r => r.category === 'calories');
    expect(calorieRec?.priority).toBe('low');
    expect(calorieRec?.title).toContain('Excelente');
  });
});
