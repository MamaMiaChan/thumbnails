import { ChartID } from '@antv/knowledge';
import { IChartImageInfo } from '../interfaces';

const id: ChartID = 'donut_chart';

const name: string = 'Donut';

const svgCode: string = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g fill="none" fill-rule="evenodd">
    <path fill="#5B8FF9" d="M512.362597,117 C670.011166,117 812.592328,210.601566 875.202124,355.196603 C937.811921,499.791639 908.482375,667.740534 800.564503,782.591762 L800.564503,782.591762 L683.382554,672.616313 C722.458816,630.842231 746.380127,574.714667 746.380127,512.99998 C746.380127,383.928318 641.746871,279.295062 512.675209,279.295062 L512.362597,279.298 Z" opacity=".95"/>
    <path fill="#5AD8A6" d="M207.73579,260.259636 L332.860394,363.710155 C299.207414,404.199285 278.970291,456.236316 278.970291,512.99998 C278.970291,642.071642 383.603547,746.704898 512.675209,746.704898 C580.031695,746.704898 640.732845,718.210022 683.381622,672.617309 L800.564503,782.591762 C654.404069,938.142505 411.06844,949.610968 250.909177,808.497142 C90.7499153,667.383317 71.6368039,424.675364 207.73579,260.259636 L207.73579,260.259636 Z" opacity=".95"/>
    <path fill="#FF9845" d="M512.362597,117 L512.36179,279.298 L508.810471,279.326372 C438.066992,280.47337 374.964617,313.053591 332.86122,363.709161 L207.73579,260.259636 C282.843433,169.525103 394.532636,117 512.362597,117 L512.362597,117 Z" opacity=".95"/>
    <text fill="#000" font-family="PingFangSC-Medium, PingFang SC" font-size="71.409" font-weight="400">
      <tspan x="776.871" y="415">A</tspan>
    </text>
    <text fill="#000" font-family="PingFangSC-Medium, PingFang SC" font-size="71.409" font-weight="400">
      <tspan x="230.942" y="688">B</tspan>
    </text>
    <text fill="#FFF" font-family="PingFangSC-Regular, PingFang SC" font-size="72">
      <tspan x="351.292" y="256">C</tspan>
    </text>
  </g>
</svg>
`;

const url: string = 'https://gw.alipayobjects.com/zos/antfincdn/6m8gNSL8lD/Donut.svg';

const Donut: IChartImageInfo = {
  id,
  name,
  svgCode,
  url,
};

export default Donut;