class IP {
    constructor(p1, p2, p3, p4) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;

        this.bitMap = (p1 << 24) + (p2 << 16) + (p3 << 8) + p4;
    }
    
    static FromBitMap(bitMap) {
        return new IP((bitMap >> 24) & 255, (bitMap >> 16) & 255, (bitMap >> 8) & 255, bitMap & 255);
    }

    MaskPrefix(mask) {
        let bitMap = (this.bitMap >> mask.Offset()) << mask.Offset();
        return IP.FromBitMap(bitMap);
    }

    toString() {
        return `${this.p1}.${this.p2}.${this.p3}.${this.p4}`;
    }

    equals(ip) {
        return this.bitMap == ip.bitMap
    }
}

class Mask {
    constructor(prefix) {
        this.prefix = prefix;
    }

    Offset() {
        return 32 - this.prefix;
    }

    toString() {
        return `${this.prefix}`;
    }
}

class SubNet {
    constructor(address, mask, count) {
        this.address = address;
        this.mask = mask;
        this.count = count
    }

    Broadcast() {
        return IP.FromBitMap(this.address.bitMap | ((1 << this.mask.Offset()) - 1));
    }

    toString() {
        return `${this.address}/${this.mask}`;
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
        let norm = count < 2 ? 2 : count;
        let mask = this.GetMaskForCount(norm);
        this.FindFreeAddress(mask, count);
    }

    static GetNextSubNet(subNet, mask, count) {
        let address = IP.FromBitMap(subNet.Broadcast().bitMap + 1);
        if (address.MaskPrefix(mask).equals(address))
            return new SubNet(address, mask, count);
        let ip = IP.FromBitMap(address.MaskPrefix(mask).bitMap + (1 << mask.Offset()));
        return new SubNet(ip, mask, count);
    }

    FindFreeAddress(mask, count) {
        if (this.subnets.length == 0) {
            this.subnets.push(new SubNet(this.address, mask, count));
            return;
        }

        for(let i = 0; i < this.subnets.length; i++) {
            let nextSubNet = AddressSpace.GetNextSubNet(this.subnets[i], mask, count);
            if (i + 1 == this.subnets.length) {
                this.subnets.push(nextSubNet);
                return;
            }

            if (nextSubNet.Broadcast().bitMap + 1 <= this.subnets[i+1].address.bitMap) {
                this.subnets.splice(i+1, 0, nextSubNet);
                return;
            }
        }
    }

    toString() {
        let ret = "";
        this.subnets.forEach(e => ret += e.toString() + " B: " + e.Broadcast() + "\n");
        return ret;
    }
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}
