import datetime

base = datetime.datetime(2025, 9, 7)
date_list = [base + datetime.timedelta(days=x*7) for x in range(14)]

with open("tmp.sql", "w", encoding="utf-8") as f:
  for (weekid, date) in zip(range(1, 15), date_list):
      f.write(f"(NULL, 'h270402', '', NULL, NULL, NULL, 1, 'IB001e-00023', 'dotnetf', '.NET F#', 'ea', 'n', 2, NULL, NULL, NULL, {weekid}, NULL, NULL, '{date.date()}', 14, 0, NULL, 'IR-217', 'IR-217 PC terem'),\n")
      f.write(f"(NULL, 'h270402', '', NULL, NULL, NULL, 2, 'IB009L-00009', 'unity2d', '2D játékfejlesztés Unity-ben', 'gy', 'n', 2, NULL, NULL, NULL, {weekid}, NULL, NULL, '{date.date()}', 15, 1, NULL, 'IR-217', 'IR-217 PC terem'),\n")
      f.write(f"(NULL, 'h270402', '', NULL, NULL, NULL, 3, 'IMN209E', 'geptanelm', 'A gépi tanulás elmélete', 'ea', 'n', 2, NULL, NULL, NULL, {weekid}, NULL, NULL, '{date.date()}', 16, 0, NULL, 'IR-217', 'IR-217 PC terem'),\n")
      f.write(f"(NULL, 'h270402', '', NULL, NULL, NULL, 4, 'IMN209G', 'geptanelm_gy', 'A gépi tanulás elmélete gyak.', 'gy', 'n', 1, NULL, NULL, NULL, {weekid}, NULL, NULL, '{date.date()}', 17, 3, NULL, 'IR-217', 'IR-217 PC terem'),\n")