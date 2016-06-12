Dropzone.options.upload = {
    paramName: 'file',
    maxFilesize: 10, // MB
    acceptedFiles: 'image/*',
    parallelUploads: 10,
    addRemoveLinks: true,
    init: function() {
        this.on('success', function( file, resp ){
        });
    }
};