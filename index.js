const { Extension, type, api } = require('clipcc-extension');
const { Howl, Howler } = require('howler');
const vm = api.getVmInstance();
const loadedAudio = {};

class LazyAudioExtension extends Extension {
    loadAudio(id, globalVolume, r) {
        console.log(loadedAudio);
        if (r in loadedAudio) return;
        try {
            loadedAudio[r] = new Howl({
                xhr: { method: 'GET' },
                src: 'https://api.shwstpro.cn:10002/api/assets/' + id,
                autoplay: false,
                loop: false,
                playlock: false,
                volume: globalVolume * 0.01,
                onend: function () {
                    return;
                }
            })
            console.log(loadedAudio);
        } catch (err) {
            console.log(err);
            console.log(loadedAudio);
            delete loadedAudio[r];
        }
        return;
    }
    unloadAudio(r) {
        if (r in loadedAudio) {
            loadedAudio[r].unload();
            delete loadedAudio[r];
        }
        return;
    }
    setAudioVolume(r, vol) {
        if (r in loadedAudio) {
            loadedAudio[r].volume(vol/100);
        }
        return;
    }
    state(r) {
        if (loadedAudio[r]) return loadedAudio[r].state();
        return NaN;
    }
    play(r) {
        if (r in loadedAudio && !loadedAudio[r].playing()) {
            loadedAudio[r].play();
        }
        return;
    }

    pause(r) {
        if (r in loadedAudio && loadedAudio[r].playing()) {
            loadedAudio[r].pause();
        }
        return;
    }

    stop(r) {
        if (r in loadedAudio) {
            loadedAudio[r].stop();
        }
        return;
    }

    setRate(r,rate){
        if (r in loadedAudio) {
            loadedAudio[r].rate(rate);
        }
        return;
    }//设置播放速率

    getSeek(r){
        if (r in loadedAudio) {
            return loadedAudio[r].seek();
        }
        return NaN;
    }//获取播放位置

    setSeek(r,sec){
        if (r in loadedAudio) {
            loadedAudio[r].seek(sec);
        }
        return;
    }//设置播放位置

    loop(r,tf) {
        if (r in loadedAudio) {
            if(tf=='true')  tf=true;
            else tf=false;
            loadedAudio[r].loop(tf);
        }
        return;
    }

    duration(r) {
        if (r in loadedAudio) {
            return loadedAudio[r].duration();
        }
        return NaN;
    }


    onInit() {
        let globalVolume = 100;
        api.addCategory({
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            messageId: 'jasonxu.lazyAudio.lazyAudio.messageid',
            color: '#888777'
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.loadAudio.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.loadAudio',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.loadAudio(args.ID, globalVolume, args.R),
            param: {
                ID: {
                    type: type.ParameterType.STRING,
                    default: 'test.mp3'
                }, R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.play.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.play',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.play(args.R),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.playFrom.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.playFrom',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => {
                this.setSeek(args.R,args.SEC);
                this.play(args.R);
            },
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                },SEC: {
                    type: type.ParameterType.NUMBER,
                    default: 5
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.pause.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.pause',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.pause(args.R),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.stop.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.stop',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.stop(args.R),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        }); 

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.setVolume.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.setVolume',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.setAudioVolume(args.R,args.VOL),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                },VOL: {
                    type: type.ParameterType.NUMBER,
                    default: 100
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.setGlobalVolume.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.setGlobalVolume',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => {
                globalVolume = args.VOL;
                Howler.volume(args.VOL/100);
            },
            param: {
                VOL: {
                    type: type.ParameterType.NUMBER,
                    default: 100
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.setSeek.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.setSeek',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.setSeek(args.R,args.SEC),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                },SEC: {
                    type: type.ParameterType.NUMBER,
                    default: 5
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.loop.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.loop',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.loop(args.R,args.TF),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                },TF: {
                    type: type.ParameterType.STRING,
                    field: true,
                    menu: [{
                        messageId: 'jasonxu.lazyAudio.true',
                        value: 'true'
                    }, {
                        messageId: 'jasonxu.lazyAudio.false',
                        value: 'false'
                    }],
                    default: 'false'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.setRate.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.lazyAudio.setRate',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.setRate(args.R,args.RATE/100),
            param: {
                RATE: {
                    type: type.ParameterType.NUMBER,
                    default: 100
                },R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.state.opcode',
            type: type.BlockType.REPORTER,
            messageId: 'jasonxu.lazyAudio.state',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.state(args.R),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.seek.opcode',
            type: type.BlockType.REPORTER,
            messageId: 'jasonxu.lazyAudio.seek',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.getSeek(args.R),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.duration.opcode',
            type: type.BlockType.REPORTER,
            messageId: 'jasonxu.lazyAudio.duration',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => this.duration(args.R),
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.lazyAudio.isPlaying.opcode',
            type: type.BlockType.BOOLEAN,
            messageId: 'jasonxu.lazyAudio.isPlaying',
            categoryId: 'jasonxu.lazyAudio.lazyAudio',
            function: args => {
                if (args.R in loadedAudio) return loadedAudio[args.R].playing();
                return NaN;
            },
            param: {
                R: {
                    type: type.ParameterType.STRING,
                    default: 'Simon'
                }
            }
        });
    }

    onUninit() {
        api.removeCategory('jasonxu.lazyAudio.lazyAudio');
    }
}
    /*vm.on('PROJECT_RUN_STOP',()=>{
        for(audio in loadedAudio){
            if(loadedAudio[audio].playing())    loadedAudio[audio].stop();
            loadedAudio[audio].unload();
            delete loadedAudio[audio];
        }
        loadedAudio = {};
    });*/

module.exports = LazyAudioExtension;


