class IP {
    constructor(p1, p2, p3, p4) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
    }
}

class Mask {
    constructor(prefix) {
        this.prefix = prefix;
    }
}

class SubNet {
    constructor(address, mask) {
        this.address = address;
        this.mask = mask;
    }
}

class AddressSpace {

    constructor(address, mask) {
        this.address = address;
        this.mask = mask;
        this.subnets = [];
    }

    GetMaskForCount(count) {
        return new Mask(Math.clz32(count + 1));
    }

    AddSubNet(count) {
        mask = this.GetMaskForCount(count);
    }

    FindFreeAddress(mask) {
        if (this.subnets.length == 0) {
            this.subnets.push(new SubNet(this.address, mask));
            return;
        }
        // get size of empty block
        for(i = 0; i < this.subnets.length; i++) {
            this.subnets[i]
        }
    }
}
