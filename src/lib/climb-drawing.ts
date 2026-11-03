import { length, profile, rise, street, elevationAt } from './model';

// The street runs 920 units for 600 m (1.53 per m) and rises 4.2 per m, so height is drawn 2.7 times its scale.
export const X0 = 40, X1 = 960, Y0 = 360, VS = 4.2;
export const exaggeration = Math.round((VS / ((X1 - X0) / length)) * 10) / 10; // 2.7
export const px = (d: number) => X0 + (X1 - X0) * d / length;
export const py = (e: number) => Y0 - e * VS;

export const roadPath = 'M' + profile.map(([d, e]) => `${px(d).toFixed(1)} ${py(e).toFixed(1)}`).join(' L');
export const groundPath = `${roadPath} L${X1} ${Y0 + 30} L${X0} ${Y0 + 30}z`;

export const segmentMarks = (() => {
  let acc = 0;
  return street.segments.map(([len, g]) => {
    const mid = acc + len / 2; acc += len;
    return { end: acc, mid, grade: Math.round(g * 100), x: px(acc), y: py(elevationAt(acc)), midX: px(mid) };
  });
})();

export const riseLabel = { x: X1, y: py(rise) - 22, text: `+${Math.round(rise)} m` };

// Angle of the rider on the drawing, in degrees, for a grade.
export const riderAngle = (grade: number) => -Math.atan(grade * VS * length / (X1 - X0)) * 180 / Math.PI;
