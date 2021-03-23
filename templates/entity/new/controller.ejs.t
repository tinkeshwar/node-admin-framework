---
to: src/controllers/<%= h.inflection.classify(name) %>Controller.ts
---

import <%= h.inflection.classify(name) %> from '../models/<%= h.inflection.classify(name) %>';
import MasterController from './MasterController';

class <%= h.inflection.classify(name) %>Controller extends MasterController<typeof <%= h.inflection.classify(name) %>> {
    
    constructor(){
        super(<%= h.inflection.classify(name) %>);
    }
}

export default <%= h.inflection.classify(name) %>Controller;