import os from 'os';
import pidusage from 'pidusage';

class CPUService{

    static async cpuLoad(){
        const start: {idle: number, total: number} = await this.cpuAverage();
        const load = async () => {
            const end: {idle: number, total: number} = await this.cpuAverage();
            const dif = {} as {idle: number, total: number, percent: number}
            dif.idle  = end.idle  - start.idle
            dif.total = end.total - start.total
            dif.percent = dif.total ? 1 - dif.idle / dif.total: 0;
            return dif;
        }
        return await load();
    }

    static async cpuAverage(){
        let totalIdle = 0
        let totalTick = 0

        const cpus = os.cpus()
        for (const cpu in cpus){
            if(cpus.hasOwnProperty(cpu)){
                for(const type in cpus[cpu].times){
                    if(cpus[cpu].times.hasOwnProperty(type)){
                        const times: any = cpus[cpu].times;
                        totalTick += times[type];
                    }
                }
                totalIdle += cpus[cpu].times.idle;
            }
        }
        const idle = ((totalIdle/1000) / cpus.length);
        const total = ((totalTick/1000) / cpus.length);
        const percent = (total-idle);

        return {
            idle,
            total,
            percent
        }
    }

    static async systemUsage(){
        return os.loadavg();
    }

    static async cpuProcess(){
        return await pidusage(process.pid);
    }
}

export default CPUService;
