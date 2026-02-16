# Upgrade Tree Structure

## Scoring Formula
```
Score per keystroke = Base × Key Multiplier × Combo Multiplier
```

## Upgrade Progression Tree

```
                    [1] Vowel Power (100)
                    2× vowel multiplier
                   /                    \
                  /                      \
     [2] Consonant Boost (500)      [3] Keyboard I (2,000)      [4] Vowel Mastery (6,000)
     2× consonant multiplier         base 1 → 3                  3× vowel multiplier
              |                           |                              |
              |                           |                              |
     [5] Consonant Mastery (15,000)      |                              |
     3× consonant multiplier              |                              |
              \                           |                             /
               \                          |                            /
                \                         |                           /
                 \________________________|__________________________/
                                          |
                              [6] Combo System (30,000)
                              Unlock 2× combo at 60 WPM
                             /                          \
                            /                            \
             [7] Combo Efficiency (200,000)      [8] Speed Demon (500,000)
             Lower 2× threshold to 40 WPM        Unlock 3× combo at 80 WPM


     [3] Keyboard I (2,000)
              |
     [10] Keyboard II (80,000)
     base 3 → 10


     [3] + [4] + [5]
              |
     [9] Unbreakable Focus (1,500,000)
     Mistakes don't break combos
```

## Upgrade Details

| ID | Name | Cost | Effect | Requires |
|----|------|------|--------|----------|
| 1 | Vowel Power | 100 | Vowels give 2× score | — |
| 2 | Consonant Boost | 500 | Consonants give 2× score | 1 |
| 3 | Keyboard Upgrade I | 2,000 | Base score 1 → 3 | 1 |
| 4 | Vowel Mastery | 6,000 | Vowels give 3× score | 1 |
| 5 | Consonant Mastery | 15,000 | Consonants give 3× score | 2 |
| 6 | Combo System | 30,000 | Unlock 2× combo at 60 WPM | 3, 4, 5 |
| 10 | Keyboard Upgrade II | 80,000 | Base score 3 → 10 | 3 |
| 7 | Combo Efficiency | 200,000 | Lower 2× combo to 40 WPM | 6 |
| 8 | Speed Demon | 500,000 | Unlock 3× combo at 80 WPM | 6 |
| 9 | Unbreakable Focus | 1,500,000 | Mistakes don't break combos | 3, 4, 5 |

## Expected Progression (at ~100 WPM)

1. **Start** → Base: 1, Keys: 1×, Combo: 1× = **500 pts/min**
2. **After ID 1** → Base: 1, Keys: 1.4×, Combo: 1× = **700 pts/min**
3. **After ID 2** → Base: 1, Keys: 2×, Combo: 1× = **1,000 pts/min**
4. **After ID 3** → Base: 3, Keys: 2×, Combo: 1× = **3,000 pts/min**
5. **After ID 4** → Base: 3, Keys: 2.4×, Combo: 1× = **3,600 pts/min**
6. **After ID 5** → Base: 3, Keys: 3×, Combo: 1× = **4,500 pts/min**
7. **After ID 6** → Base: 3, Keys: 3×, Combo: 2× = **9,000 pts/min** (if maintaining 60 WPM)
8. **After ID 10** → Base: 10, Keys: 3×, Combo: 2× = **30,000 pts/min**
9. **After ID 7** → Same rate, easier to maintain combo
10. **After ID 8** → Base: 10, Keys: 3×, Combo: 3× = **45,000 pts/min** (if maintaining 80 WPM)
11. **After ID 9** → Same rate, combo never breaks

## Notes
- Costs are exponentially scaled for roughly 1-2 minute unlock intervals
- Key multiplier averages assume ~40% vowels, 60% consonants in English text
- Combo multipliers only apply when maintaining the WPM threshold
- Final upgrade allows combo to persist through mistakes/backspaces
